/**
 * The shape every provider is squeezed into.
 *
 * Members bring their own key, and not everyone has the same one — so the
 * chat route talks to this interface and never to a vendor SDK directly.
 * Adding a provider means adding an adapter file; nothing above it changes.
 */

export type AiProvider = "anthropic" | "openai" | "google" | "deepseek";

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

/**
 * The one tool a model may be offered — an allowlist of one, by design.
 * `execute` runs on OUR server against RLS-scoped data and its result goes
 * back into the same conversation; that is why this is not the exfiltration
 * surface provider-side tools would be.
 */
export interface AiTool {
  name: string;
  description: string;
  /** JSON Schema for the tool input (an object schema). */
  inputSchema: Record<string, unknown>;
  /** Model-generated input — treat as untrusted. Returns the tool result. */
  execute(input: Record<string, unknown>): Promise<string>;
}

export interface AiStreamRequest {
  apiKey: string;
  model: string;
  system: string;
  turns: ChatTurn[];
  maxTokens: number;
  /** Offered to the model when present; execution stays server-side. */
  tool?: AiTool;
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
  /** The model called the tool; `query` is what it searched for. */
  | { type: "tool"; query: string }
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
