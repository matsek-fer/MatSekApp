/**
 * Adapter registry — the entry point for everything outside lib/ai.
 *
 * The registry is a lazy module singleton, the same shape as the transporter
 * in lib/email.ts. The provider clients underneath it are deliberately NOT
 * singletons: they are built per request from the member's own key.
 */

import { anthropicAdapter } from "@/lib/ai/anthropic";
import { deepseekAdapter } from "@/lib/ai/deepseek";
import { googleAdapter } from "@/lib/ai/google";
import { openaiAdapter } from "@/lib/ai/openai";
import type { AiAdapter, AiModel, AiProvider } from "@/lib/ai/types";

let registry: Record<AiProvider, AiAdapter> | null = null;

function getRegistry(): Record<AiProvider, AiAdapter> {
  if (registry) return registry;

  registry = {
    anthropic: anthropicAdapter,
    openai: openaiAdapter,
    google: googleAdapter,
    deepseek: deepseekAdapter,
  };

  return registry;
}

export function getAdapter(provider: AiProvider): AiAdapter {
  return getRegistry()[provider];
}

/**
 * The allowlist a request's model is checked against.
 *
 * Model ids arrive from the browser, so they are treated the way `status` is
 * treated in the activities route: validated against a known set before they
 * reach anything that acts on them. An unchecked model string is how you get
 * billed for a tier you did not choose.
 */
export function listModels(provider: AiProvider): readonly AiModel[] {
  return getRegistry()[provider].models;
}

export function defaultModel(provider: AiProvider): string {
  const models = listModels(provider);
  return (models.find((m) => m.isDefault) ?? models[0]).id;
}

export const AI_PROVIDERS: readonly AiProvider[] = [
  "anthropic",
  "openai",
  "google",
  "deepseek",
];
