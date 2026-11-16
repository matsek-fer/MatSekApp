/**
 * Password hashing with Node's own scrypt — no native module to build, and
 * scrypt is memory-hard, which is what makes a stolen table expensive to
 * crack on GPUs.
 *
 * Stored as `scrypt$N$r$p$salt$hash` (base64) so the cost can be raised later
 * without invalidating existing hashes: verify reads the parameters from the
 * string, not from these constants.
 */

import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

// N = 2^15 with r = 8 is ~32 MiB and ~50 ms per hash — the OWASP baseline.
// maxmem has to be raised above Node's 32 MiB default to allow it.
const N = 32768;
const R = 8;
const P = 1;
const KEY_LENGTH = 64;
const MAX_MEM = 64 * 1024 * 1024;

export const MIN_PASSWORD_LENGTH = 8;
// scrypt hashes any length in the same time, but a megabyte "password" is
// still a megabyte to read and hold; nobody types more than this.
export const MAX_PASSWORD_LENGTH = 256;

function derive(
  password: string,
  salt: Buffer,
  n: number,
  r: number,
  p: number,
  length: number
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, length, { N: n, r, p, maxmem: MAX_MEM }, (err, key) =>
      err ? reject(err) : resolve(key)
    );
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await derive(password, salt, N, R, P, KEY_LENGTH);
  return [
    "scrypt",
    N,
    R,
    P,
    salt.toString("base64"),
    hash.toString("base64"),
  ].join("$");
}

export async function verifyPassword(
  password: string,
  stored: string
): Promise<boolean> {
  const [scheme, n, r, p, salt, hash] = stored.split("$");
  if (scheme !== "scrypt" || !salt || !hash) return false;

  const expected = Buffer.from(hash, "base64");
  const actual = await derive(
    password,
    Buffer.from(salt, "base64"),
    Number(n),
    Number(r),
    Number(p),
    expected.length
  );
  return timingSafeEqual(actual, expected);
}

// A real hash of nothing in particular. Login checks unknown addresses
// against it so "no such account" takes as long as "wrong password" — the
// timing would otherwise tell anyone which @fer.hr addresses are registered.
let dummyHash: Promise<string> | null = null;

export async function burnPasswordCheck(password: string): Promise<void> {
  dummyHash ??= hashPassword(randomBytes(16).toString("hex"));
  await verifyPassword(password, await dummyHash);
}
