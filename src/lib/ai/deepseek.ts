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

/** Backstop on stream→tool→stream cycles; the route caps real searches. */
const MAX_TOOL_ROUNDS = 4;

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

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: req.system },
      ...req.turns.map((turn) => ({
        role: turn.role,
        content: turn.content,
      })),
    ];

    const tools: OpenAI.Chat.ChatCompletionTool[] | undefined = req.tool
      ? [
          {
            type: "function",
            function: {
              name: req.tool.name,
              description: req.tool.description,
              parameters: req.tool.inputSchema,
            },
          },
        ]
      : undefined;

    try {
      for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
        const stream = await client.chat.completions.create(
          {
            model: req.model,
            messages,
            max_tokens: req.maxTokens,
            stream: true,
            tools,
          },
          { signal: req.signal }
        );

        // Chat-completions streams tool calls as fragments keyed by index:
        // the id and name arrive once, the JSON arguments in pieces.
        const calls = new Map<
          number,
          { id: string; name: string; arguments: string }
        >();
        let streamedText = "";

        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta;
          if (delta?.content) {
            streamedText += delta.content;
            yield { type: "text", text: delta.content };
          }
          for (const fragment of delta?.tool_calls ?? []) {
            const call = calls.get(fragment.index) ?? {
              id: "",
              name: "",
              arguments: "",
            };
            if (fragment.id) call.id = fragment.id;
            if (fragment.function?.name) call.name = fragment.function.name;
            if (fragment.function?.arguments) {
              call.arguments += fragment.function.arguments;
            }
            calls.set(fragment.index, call);
          }
        }

        if (calls.size > 0 && req.tool) {
          const ordered = [...calls.values()];
          messages.push({
            role: "assistant",
            content: streamedText || null,
            tool_calls: ordered.map((call) => ({
              id: call.id,
              type: "function" as const,
              function: { name: call.name, arguments: call.arguments },
            })),
          });

          for (const call of ordered) {
            let parsed: Record<string, unknown> = {};
            try {
              parsed = JSON.parse(call.arguments || "{}");
            } catch {
              // Left empty; execute reports the empty query to the model.
            }

            yield { type: "tool", query: String(parsed.query ?? "") };
            messages.push({
              role: "tool",
              tool_call_id: call.id,
              content: await req.tool.execute(parsed),
            });
          }
          continue;
        }

        yield { type: "done" };
        return;
      }

      yield { type: "done" };
    } catch (err) {
      throw toAiError("deepseek", err);
    }
  },
};
