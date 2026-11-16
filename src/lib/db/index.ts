/**
 * Postgres access — the two entry points every query goes through.
 *
 * withUser() is the default, and the counterpart of what Supabase's
 * session-carrying client used to be: each call is one transaction that
 * switches to `authenticated` (or `anon` for a visitor) and sets
 * app.user_id, so every RLS policy and column grant in db/schema.sql applies
 * exactly as written — the same two roles, under the same names.
 *
 * asService() runs as the owning role and bypasses RLS, the way the service
 * role key did. It exists for the auth internals (users, sessions, codes —
 * tables neither request role has a grant on), for reading a proposer's
 * e-mail after an admin check, and for notifying other members. Don't reach
 * for it to make a query easier.
 *
 * There is deliberately no export of the pool itself: a bare query would run
 * as the owner and silently skip every policy.
 */

import postgres, { type TransactionSql } from "postgres";

export type Tx = TransactionSql;

function connect() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set.");

  return postgres(url, {
    max: Number(process.env.DATABASE_POOL_MAX) || 10,
    // Notices are things like "relation already exists, skipping" — noise in
    // a request log.
    onnotice: false,
    types: {
      // The row types in src/types describe timestamps as ISO strings, which
      // is what Supabase returned and what the client components parse. A
      // Date would also not survive the server→client prop boundary as-is.
      timestamptz: {
        to: 1184,
        from: [1184],
        serialize: (value: string | Date) =>
          value instanceof Date ? value.toISOString() : value,
        parse: (value: string) => new Date(value).toISOString(),
      },
    },
  });
}

// One pool per process. In dev, hot reload re-evaluates this module, and a
// new pool per edit would exhaust max_connections within an afternoon.
const globalForDb = globalThis as unknown as {
  matsekSql?: ReturnType<typeof connect>;
};

function pool() {
  if (!globalForDb.matsekSql) globalForDb.matsekSql = connect();
  return globalForDb.matsekSql;
}

/**
 * Runs `fn` in a transaction as `authenticated` acting for `userId`, or as
 * `anon` when it is null. Keep it short: the transaction holds a pooled
 * connection until `fn` settles.
 */
export async function withUser<T>(
  userId: string | null,
  fn: (tx: Tx) => Promise<T>
): Promise<T> {
  return (await pool().begin(async (tx) => {
    // Two literal statements rather than an interpolated role name: SET ROLE
    // takes an identifier, which a query parameter cannot be.
    if (userId) await tx`SET LOCAL ROLE authenticated`;
    else await tx`SET LOCAL ROLE anon`;
    // The third argument scopes the setting to this transaction, so the
    // pooled connection carries no identity into the next request.
    await tx`SELECT set_config('app.user_id', ${userId ?? ""}, true)`;
    return fn(tx);
  })) as T;
}

/** Runs `fn` in a transaction as the owning role, bypassing RLS. */
export async function asService<T>(fn: (tx: Tx) => Promise<T>): Promise<T> {
  return (await pool().begin((tx) => fn(tx))) as T;
}
