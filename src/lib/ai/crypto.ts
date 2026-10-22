/**
 * Sealing for members' provider API keys.
 *
 * A key belongs to the member, not to us: it bills to their personal account
 * and we can neither rotate nor revoke it on their behalf. So it is encrypted
 * before it is written anywhere, and the secret that decrypts it lives in the
 * environment rather than beside the ciphertext.
 *
 * In the MVP the sealed blob goes into an httpOnly cookie and never reaches
 * the database (see lib/ai/keys.ts). The format below is deliberately the same
 * one a `ai_provider_keys` row would use, so adding opt-in persistence later
 * does not mean re-encrypting anything.
 *
 * Unlike lib/email.ts — whose failures are logged and swallowed — everything
 * here throws. A silently-failed decryption is how you end up sending a
 * corrupted key to a provider and reporting it to the member as their mistake.
 */

import {
  createCipheriv,
  createDecipheriv,
  hkdfSync,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
import type { AiProvider } from "@/lib/ai/types";

// ── Format ─────────────────────────────────────────────────────────────────

/** Bumped only if the layout below changes; it is the first byte of the blob. */
const FORMAT_VERSION = 1;

const SALT_BYTES = 16;
const IV_BYTES = 12; // 96 bits — the size GCM is specified for.
const TAG_BYTES = 16;
const KEY_BYTES = 32; // AES-256.

/** Layout: version ‖ salt ‖ iv ‖ tag ‖ ciphertext, base64url. */
const HEADER_BYTES = 1 + SALT_BYTES + IV_BYTES + TAG_BYTES;

// ── Master secret ──────────────────────────────────────────────────────────

let masterSecret: Buffer | null = null;

/**
 * Reads AI_KEY_ENCRYPTION_SECRET on first use.
 *
 * Read inside the factory rather than at module load so importing this file
 * during a build — where the variable is legitimately absent — does not throw.
 */
function getMasterSecret(): Buffer {
  if (masterSecret) return masterSecret;

  const raw = process.env.AI_KEY_ENCRYPTION_SECRET;
  if (!raw) {
    throw new Error(
      "AI_KEY_ENCRYPTION_SECRET is not set. Generate one with `openssl rand -base64 32`."
    );
  }

  const decoded = Buffer.from(raw, "base64");
  if (decoded.length !== KEY_BYTES) {
    throw new Error(
      `AI_KEY_ENCRYPTION_SECRET must decode to ${KEY_BYTES} bytes, got ${decoded.length}.`
    );
  }

  masterSecret = decoded;
  return masterSecret;
}

// ── Derivation ─────────────────────────────────────────────────────────────

/**
 * One key per sealed blob, derived from the master secret and a fresh salt.
 *
 * The master secret therefore never encrypts anything directly, and two blobs
 * never share a key. Binding the member and provider into the HKDF `info`
 * means a blob lifted from one member's cookie cannot be opened as another's,
 * even by someone holding the master secret.
 */
function deriveKey(salt: Buffer, userId: string, provider: AiProvider): Buffer {
  const info = `matsek:ai-key:v${FORMAT_VERSION}:${userId}:${provider}`;
  return Buffer.from(
    hkdfSync("sha256", getMasterSecret(), salt, Buffer.from(info, "utf8"), KEY_BYTES)
  );
}

/**
 * Belt to the HKDF's braces: authenticated but unencrypted context, so
 * swapping the provider on a stored blob breaks the tag instead of quietly
 * sending an Anthropic key to OpenAI.
 */
function additionalData(userId: string, provider: AiProvider): Buffer {
  return Buffer.from(`${userId}|${provider}|${FORMAT_VERSION}`, "utf8");
}

// ── Public API ─────────────────────────────────────────────────────────────

/** Encrypts `plain` and returns a single base64url blob safe for a cookie. */
export function sealApiKey(
  plain: string,
  userId: string,
  provider: AiProvider
): string {
  if (!plain) throw new Error("Refusing to seal an empty key.");

  const salt = randomBytes(SALT_BYTES);
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv("aes-256-gcm", deriveKey(salt, userId, provider), iv);
  cipher.setAAD(additionalData(userId, provider));

  const ciphertext = Buffer.concat([
    cipher.update(plain, "utf8"),
    cipher.final(),
  ]);

  return Buffer.concat([
    Buffer.from([FORMAT_VERSION]),
    salt,
    iv,
    cipher.getAuthTag(),
    ciphertext,
  ]).toString("base64url");
}

/**
 * Reverses `sealApiKey`.
 *
 * Throws on any tampering, on a blob sealed for a different member or
 * provider, and on a blob sealed under a master secret we no longer hold —
 * which is what rotation looks like from here. Callers treat every failure the
 * same way: ask the member to enter the key again.
 */
export function openApiKey(
  sealed: string,
  userId: string,
  provider: AiProvider
): string {
  const blob = Buffer.from(sealed, "base64url");
  if (blob.length <= HEADER_BYTES) {
    throw new Error("Sealed key is too short to be well-formed.");
  }

  // Compared in constant time only for tidiness — the version is not secret.
  const version = blob.subarray(0, 1);
  if (!timingSafeEqual(version, Buffer.from([FORMAT_VERSION]))) {
    throw new Error(`Unsupported sealed-key format: ${version[0]}.`);
  }

  let offset = 1;
  const salt = blob.subarray(offset, (offset += SALT_BYTES));
  const iv = blob.subarray(offset, (offset += IV_BYTES));
  const tag = blob.subarray(offset, (offset += TAG_BYTES));
  const ciphertext = blob.subarray(offset);

  const decipher = createDecipheriv(
    "aes-256-gcm",
    deriveKey(salt, userId, provider),
    iv
  );
  decipher.setAAD(additionalData(userId, provider));
  decipher.setAuthTag(tag);

  return Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]).toString("utf8");
}

/**
 * The only part of a key we ever show back. Providers prefix their keys with a
 * recognisable scheme, so the tail is what actually distinguishes two of them.
 */
export function keySuffix(plain: string): string {
  return plain.slice(-4);
}
