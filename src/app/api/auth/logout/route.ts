import { endSession } from "@/lib/auth/session";
import { fail, ok, SERVER_ERROR } from "@/lib/auth/http";

/** POST /api/auth/logout — ends the session and clears the AI-key cookies. */
export async function POST() {
  try {
    await endSession();
    return ok("Odjava uspješna.");
  } catch (err) {
    console.error("Logout error:", err);
    return fail(500, SERVER_ERROR);
  }
}
