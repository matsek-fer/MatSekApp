/**
 * Anthropic adapter.
 *
 * The client is built per call, not cached in a module singleton: the key
 * belongs to whoever is reading, and a shared client would keep one member's
 * credential alive across another member's request.
 */

import Anthropic from "@anthropic-ai/sdk";
import { toAiError } from "@/lib/ai/errors";
import { PROVIDER_MODELS } from "@/lib/ai/models";
import type { AiAdapter, AiEvent, AiStreamRequest } from "@/lib/ai/types";

export const anthropicAdapter: AiAdapter = {
  provider: "anthropic",
  models: PROVIDER_MODELS.anthropic,

  async validateKey(apiKey: string): Promise<void> {
    try {
      // Authenticated, free, and returns no tokens — the cheapest way to learn
      // whether a key works before we agree to hold on to it.
      await new Anthropic({ apiKey }).models.list({ limit: 1 });
    } catch (err) {
      throw toAiError("anthropic", err);
    }
  },

  async *streamChat(req: AiStreamRequest): AsyncGenerator<AiEvent> {
    const client = new Anthropic({ apiKey: req.apiKey });

    try {
      const stream = client.messages.stream(
        {
          model: req.model,
          max_tokens: req.maxTokens,
          // Adaptive is the only thinking mode this model family accepts, and
          // it is already the default — stated so nobody "restores" a
          // budget_tokens value. Sending budget_tokens, temperature, top_p or
          // top_k here is a 400, not a tuning knob.
          thinking: { type: "adaptive" },
          system: req.system,
          messages: req.turns.map((turn) => ({
            role: turn.role,
            content: turn.content,
          })),
        },
        { signal: req.signal }
      );

      for await (const event of stream) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          yield { type: "text", text: event.delta.text };
        }
      }

      // A refusal is reported on the finished message, not as a stream error,
      // so it can only be checked once the stream has drained. Anything
      // already yielded above stays on screen; the route stops it being saved
      // as though it were an answer.
      const final = await stream.finalMessage();
      if (final.stop_reason === "refusal") {
        yield { type: "refusal", category: final.stop_details?.category ?? "" };
        return;
      }

      yield { type: "done" };
    } catch (err) {
      throw toAiError("anthropic", err);
    }
  },
};
