/**
 * OpenAI adapter.
 *
 * Uses the Responses API (`responses.create`), which is what the v7 SDK leads
 * with. The system prompt travels as `instructions`, and the conversation as
 * an `input` array of role/content messages.
 */

import OpenAI from "openai";
import { toAiError } from "@/lib/ai/errors";
import type { AiAdapter, AiEvent, AiModel, AiStreamRequest } from "@/lib/ai/types";

const MODELS: readonly AiModel[] = [
  { id: "gpt-5.5", label: "GPT-5.5", isDefault: true },
  { id: "gpt-5", label: "GPT-5", isDefault: false },
];

export const openaiAdapter: AiAdapter = {
  provider: "openai",
  models: MODELS,

  async validateKey(apiKey: string): Promise<void> {
    try {
      await new OpenAI({ apiKey }).models.list();
    } catch (err) {
      throw toAiError("openai", err);
    }
  },

  async *streamChat(req: AiStreamRequest): AsyncGenerator<AiEvent> {
    const client = new OpenAI({ apiKey: req.apiKey });

    try {
      const stream = await client.responses.create(
        {
          model: req.model,
          instructions: req.system,
          input: req.turns.map((turn) => ({
            role: turn.role,
            content: turn.content,
          })),
          max_output_tokens: req.maxTokens,
          stream: true,
        },
        { signal: req.signal }
      );

      for await (const event of stream) {
        if (event.type === "response.output_text.delta") {
          yield { type: "text", text: event.delta };
        }
      }

      yield { type: "done" };
    } catch (err) {
      throw toAiError("openai", err);
    }
  },
};
