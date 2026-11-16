import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types";

/** The auth routes' replies — Croatian, because the page shows `error` as-is. */
export function fail(status: number, error: string) {
  return NextResponse.json<ApiResponse>({ success: false, error }, { status });
}

export function ok(message: string, status = 200) {
  return NextResponse.json<ApiResponse>(
    { success: true, data: { message } },
    { status }
  );
}

export const SERVER_ERROR = "Došlo je do greške na serveru. Pokušaj ponovno.";
export const BAD_CODE = "Kod nije ispravan ili je istekao.";
export const TOO_MANY = "Previše pokušaja. Pokušaj ponovno malo kasnije.";

/** The body as a plain object, or {} — never trust its shape. */
export async function readBody(request: Request): Promise<Record<string, unknown>> {
  const body = await request.json().catch(() => null);
  return body && typeof body === "object" ? (body as Record<string, unknown>) : {};
}

export function str(value: unknown): string {
  return typeof value === "string" ? value : "";
}
