/**
 * The auth pages' one way of talking to /api/auth/*. Returns the route's
 * Croatian error as-is, or a generic one when the request never got a JSON
 * answer at all (offline, proxy error page).
 */
export async function postAuth(
  path: string,
  body: Record<string, unknown>
): Promise<{ error: string | null }> {
  try {
    const res = await fetch(`/api/auth/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => null);
    if (res.ok && json?.success) return { error: null };
    return { error: json?.error ?? "Zahtjev nije uspio. Pokušaj ponovno." };
  } catch {
    return { error: "Nema veze sa serverom. Pokušaj ponovno." };
  }
}
