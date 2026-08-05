/**
 * Google Gemini adapter.
 *
 * Gemini names the assistant role "model" rather than "assistant", and puts
 * the system prompt inside `config.systemInstruction` rather than alongside
 * the conversation — both translated here so nothing above this file has to
 * know. Tool calls arrive as functionCall parts; results go back as a user
 * turn of functionResponse parts.
 */

import { GoogleGenAI, type Content, type FunctionCall, type Part } from "@google/genai";
import { toAiError } from "@/lib/ai/errors";
import { PROVIDER_MODELS } from "@/lib/ai/models";
import type { AiAdapter, AiEvent, AiStreamRequest } from "@/lib/ai/types";

/** Backstop on stream→tool→stream cycles; the route caps real searches. */
const MAX_TOOL_ROUNDS = 4;

export const googleAdapter: AiAdapter = {
  provider: "google",
  models: PROVIDER_MODELS.google,

  async validateKey(apiKey: string): Promise<void> {
    try {
      await new GoogleGenAI({ apiKey }).models.list();
    } catch (err) {
      throw toAiError("google", err);
    }
  },

  async *streamChat(req: AiStreamRequest): AsyncGenerator<AiEvent> {
    const ai = new GoogleGenAI({ apiKey: req.apiKey });

    const contents: Content[] = req.turns.map((turn) => ({
      role: turn.role === "assistant" ? "model" : "user",
      parts: [{ text: turn.content }],
    }));

    // parametersJsonSchema takes plain JSON Schema; `parameters` would want
    // Gemini's own Schema type instead.
    const tools = req.tool
      ? [
          {
            functionDeclarations: [
              {
                name: req.tool.name,
                description: req.tool.description,
                parametersJsonSchema: req.tool.inputSchema,
              },
            ],
          },
        ]
      : undefined;

    try {
      for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
        const stream = await ai.models.generateContentStream({
          model: req.model,
          contents,
          config: {
            systemInstruction: req.system,
            maxOutputTokens: req.maxTokens,
            abortSignal: req.signal,
            tools,
          },
        });

        const calls: FunctionCall[] = [];

        for await (const chunk of stream) {
          // `text` is a convenience getter over the candidate parts; it is
          // undefined on chunks that carry only metadata.
          const text = chunk.text;
          if (text) yield { type: "text", text };

          const chunkCalls = chunk.functionCalls;
          if (chunkCalls?.length) calls.push(...chunkCalls);
        }

        if (calls.length > 0 && req.tool) {
          contents.push({
            role: "model",
            parts: calls.map((call) => ({ functionCall: call })),
          });

          const responses: Part[] = [];
          for (const call of calls) {
            const args = (call.args ?? {}) as Record<string, unknown>;
            yield { type: "tool", query: String(args.upit ?? "") };
            responses.push({
              functionResponse: {
                id: call.id,
                name: call.name ?? req.tool.name,
                response: { result: await req.tool.execute(args) },
              },
            });
          }

          contents.push({ role: "user", parts: responses });
          continue;
        }

        yield { type: "done" };
        return;
      }

      yield { type: "done" };
    } catch (err) {
      throw toAiError("google", err);
    }
  },
};
