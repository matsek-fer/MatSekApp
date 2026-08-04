/**
 * DeepSeek adapter.
 *
 * DeepSeek speaks the OpenAI wire format, so this rides the same SDK with a
 * different base URL — but the OLD half of that format: it implements Chat
 * Completions, not the Responses API the real OpenAI adapter uses. Hence the
 * system prompt travelling as a `system` message and deltas arriving on
 * `choices[0].delta.content`.
 *
 * deepseek-reasoner streams its chain of thought as a separate
 * `reasoning_content` delta before the answer. Only `content` is yielded —
 * the reasoning is the model working, not the answer, and showing it would
 * double the member's reading for no gain.
 */

import OpenAI from "openai";
import { toAiError } from "@/lib/ai/errors";
import { PROVIDER_MODELS } from "@/lib/ai/models";
import type { AiAdapter, AiEvent, AiStreamRequest } from "@/lib/ai/types";

const BASE_URL = "https://api.deepseek.com";

export const deepseekAdapter: AiAdapter = {
  provider: "deepseek",
  models: PROVIDER_MODELS.deepseek,

  async validateKey(apiKey: string): Promise<void> {
    try {
      await new OpenAI({ apiKey, baseURL: BASE_URL }).models.list();
    } catch (err) {
      throw toAiError("deepseek", err);
    }
  },

  async *streamChat(req: AiStreamRequest): AsyncGenerator<AiEvent> {
    const client = new OpenAI({ apiKey: req.apiKey, baseURL: BASE_URL });

    try {
      const stream = await client.chat.completions.create(
        {
          model: req.model,
          messages: [
            { role: "system" as const, content: req.system },
            ...req.turns.map((turn) => ({
              role: turn.role,
              content: turn.content,
            })),
          ],
          max_tokens: req.maxTokens,
          stream: true,
        },
        { signal: req.signal }
      );

      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content;
        if (text) yield { type: "text", text };
      }

      yield { type: "done" };
    } catch (err) {
      throw toAiError("deepseek", err);
    }
  },
};
