/**
 * OpenAI adapter.
 *
 * Uses the Responses API (`responses.create`), which is what the v7 SDK leads
 * with. The system prompt travels as `instructions`, and the conversation as
 * an `input` array of role/content messages. Tool calls arrive as
 * `function_call` output items; results go back as `function_call_output`
 * items appended to the next request's input.
 */

import OpenAI from "openai";
import { toAiError } from "@/lib/ai/errors";
import { PROVIDER_MODELS } from "@/lib/ai/models";
import type { AiAdapter, AiEvent, AiStreamRequest } from "@/lib/ai/types";

/** Backstop on stream→tool→stream cycles; the route caps real searches. */
const MAX_TOOL_ROUNDS = 4;

export const openaiAdapter: AiAdapter = {
  provider: "openai",
  models: PROVIDER_MODELS.openai,

  async validateKey(apiKey: string): Promise<void> {
    try {
      await new OpenAI({ apiKey }).models.list();
    } catch (err) {
      throw toAiError("openai", err);
    }
  },

  async *streamChat(req: AiStreamRequest): AsyncGenerator<AiEvent> {
    const client = new OpenAI({ apiKey: req.apiKey });

    const input: OpenAI.Responses.ResponseInput = req.turns.map((turn) => ({
      role: turn.role,
      content: turn.content,
    }));

    const tools: OpenAI.Responses.FunctionTool[] | undefined = req.tool
      ? [
          {
            type: "function",
            name: req.tool.name,
            description: req.tool.description,
            parameters: req.tool.inputSchema,
            strict: false,
          },
        ]
      : undefined;

    try {
      for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
        const stream = await client.responses.create(
          {
            model: req.model,
            instructions: req.system,
            input,
            max_output_tokens: req.maxTokens,
            stream: true,
            tools,
          },
          { signal: req.signal }
        );

        const calls: OpenAI.Responses.ResponseFunctionToolCall[] = [];

        for await (const event of stream) {
          if (event.type === "response.output_text.delta") {
            yield { type: "text", text: event.delta };
          } else if (event.type === "response.completed") {
            for (const item of event.response.output) {
              if (item.type === "function_call") calls.push(item);
            }
          }
        }

        if (calls.length > 0 && req.tool) {
          for (const call of calls) {
            input.push(call);

            // `arguments` is model-generated JSON and the SDK warns it may
            // not parse; a garbled call still deserves a structured answer.
            let parsed: Record<string, unknown> = {};
            try {
              parsed = JSON.parse(call.arguments || "{}");
            } catch {
              // Left empty; execute reports the empty query in Croatian.
            }

            yield { type: "tool", query: String(parsed.upit ?? "") };
            input.push({
              type: "function_call_output",
              call_id: call.call_id,
              output: await req.tool.execute(parsed),
            });
          }
          continue;
        }

        yield { type: "done" };
        return;
      }

      yield { type: "done" };
    } catch (err) {
      throw toAiError("openai", err);
    }
  },
};
