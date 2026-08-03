/**
 * The shape every provider is squeezed into.
 *
 * Members bring their own key, and not everyone has the same one — so the
 * chat route talks to this interface and never to a vendor SDK directly.
 * Adding a provider means adding an adapter file; nothing above it changes.
 */

export type AiProvider = "anthropic" | "openai" | "google";

export interface AiModel {
  id: string;
  /** Shown in the picker. */
  label: string;
  isDefault: boolean;
}

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface AiStreamRequest {
  apiKey: string;
  model: string;
  system: string;
  turns: ChatTurn[];
  maxTokens: number;
  /** Aborted when the member cancels or their connection drops. */
  signal: AbortSignal;
}

/**
 * `refusal` is separate from an error: the provider declined, the request was
 * well-formed, and the member is owed an explanation rather than a stack of
 * partial text. Whatever text arrived before it is discarded.
 */
export type AiEvent =
  | { type: "text"; text: string }
  | { type: "refusal"; category: string }
  | { type: "done" };

export interface AiAdapter {
  readonly provider: AiProvider;
  readonly models: readonly AiModel[];
  /** Cheapest authenticated call the provider offers. Throws AiError. */
  validateKey(apiKey: string): Promise<void>;
  streamChat(req: AiStreamRequest): AsyncGenerator<AiEvent>;
}

/** What the browser is allowed to know about a stored key. */
export interface AiKeyInfo {
  provider: AiProvider;
  suffix: string;
}
