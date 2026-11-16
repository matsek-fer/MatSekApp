/**
 * Croatian messages for the database errors a member's own input can cause.
 * Supabase handed back Postgres's English message verbatim and the routes
 * showed it; these replace that for the cases a form can actually hit.
 * Anything else is a bug, gets null, and the route answers with a 500.
 */
export function userFacingDbError(err: unknown): string | null {
  const e = err as { code?: string; constraint_name?: string };
  switch (e?.code) {
    case "23514": // check_violation
      return e.constraint_name === "chk_time_order"
        ? "Vrijeme završetka mora biti nakon vremena početka."
        : "Podaci nisu valjani.";
    case "22P02": // invalid_text_representation — a bad enum or uuid
    case "22007": // invalid_datetime_format
    case "22008": // datetime_field_overflow
      return "Neispravan format podataka.";
    case "23502": // not_null_violation
      return "Nedostaje obavezno polje.";
    case "42501": // insufficient_privilege — includes an RLS WITH CHECK refusal
      return "Nemaš dozvolu za ovu radnju.";
    default:
      return null;
  }
}
