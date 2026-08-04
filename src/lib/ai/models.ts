/**
 * The model allowlists — pure data, importable from the browser.
 *
 * This file exists because of what it does NOT import. The adapters pull in
 * their vendor SDKs, so anything the client needs from lib/ai has to live
 * apart from them or the SDKs ride into the bundle. The adapters import
 * their list from here; the model picker imports it from here; the server
 * checks incoming ids against it. One list, no copy to drift.
 */

import type { AiModel, AiProvider } from "@/lib/ai/types";

export const PROVIDER_MODELS: Record<AiProvider, readonly AiModel[]> = {
  anthropic: [
    { id: "claude-opus-5", label: "Claude Opus 5", isDefault: true },
    { id: "claude-sonnet-5", label: "Claude Sonnet 5", isDefault: false },
    { id: "claude-haiku-4-5", label: "Claude Haiku 4.5", isDefault: false },
  ],
  openai: [
    { id: "gpt-5.5", label: "GPT-5.5", isDefault: true },
    { id: "gpt-5", label: "GPT-5", isDefault: false },
  ],
  // Flash is the default on purpose: members bring free-tier keys, and a
  // free Gemini key asking for Pro is refused with a 404. Pro stays
  // selectable for anyone whose key has it.
  google: [
    { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash", isDefault: true },
    { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro", isDefault: false },
  ],
};

export function defaultModelFor(provider: AiProvider): string {
  const models = PROVIDER_MODELS[provider];
  return (models.find((m) => m.isDefault) ?? models[0]).id;
}
