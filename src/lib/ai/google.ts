/**
 * Google Gemini adapter.
 *
 * Gemini names the assistant role "model" rather than "assistant", and puts
 * the system prompt inside `config.systemInstruction` rather than alongside
 * the conversation — both translated here so nothing above this file has to
 * know.
 */

import { GoogleGenAI } from "@google/genai";
import { toAiError } from "@/lib/ai/errors";
import type { AiAdapter, AiEvent, AiModel, AiStreamRequest } from "@/lib/ai/types";

const MODELS: readonly AiModel[] = [
  { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro", isDefault: true },
  { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash", isDefault: false },
];

export const googleAdapter: AiAdapter = {
  provider: "google",
  models: MODELS,

  async validateKey(apiKey: string): Promise<void> {
    try {
      await new GoogleGenAI({ apiKey }).models.list();
    } catch (err) {
      throw toAiError("google", err);
    }
  },

  async *streamChat(req: AiStreamRequest): AsyncGenerator<AiEvent> {
    const ai = new GoogleGenAI({ apiKey: req.apiKey });

    try {
      const stream = await ai.models.generateContentStream({
        model: req.model,
        contents: req.turns.map((turn) => ({
          role: turn.role === "assistant" ? "model" : "user",
          parts: [{ text: turn.content }],
        })),
        config: {
          systemInstruction: req.system,
          maxOutputTokens: req.maxTokens,
          abortSignal: req.signal,
        },
      });

      for await (const chunk of stream) {
        // `text` is a convenience getter over the candidate parts; it is
        // undefined on chunks that carry only metadata.
        const text = chunk.text;
        if (text) yield { type: "text", text };
      }

      yield { type: "done" };
    } catch (err) {
      throw toAiError("google", err);
    }
  },
};
