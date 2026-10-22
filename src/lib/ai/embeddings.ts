/**
 * Local embeddings — the piece that makes retrieval provider-independent.
 *
 * Passages and queries are embedded ON THIS SERVER by an open-source model
 * (multilingual-e5-small, 384 dims, Croatian covered), through ONNX in Node.
 * No provider API is involved: members whose provider has no embeddings
 * endpoint at all — Anthropic, DeepSeek — retrieve exactly as well as anyone
 * else, and nobody's key is spent on indexing.
 *
 * The pipeline is a module-level lazy singleton, the email.ts/registry
 * shape: ~130 MB of model loads once per process (≈0.8 s warm from disk
 * cache, ≈25 s the very first time while it downloads) and then embeds a
 * passage in single-digit milliseconds. This is why the app wants a
 * long-lived process rather than serverless.
 *
 * e5 requires its role prefixes — "query: " and "passage: " — and was
 * trained with them; embeddings made without them land in a measurably
 * worse part of the space. They are added HERE so no caller can forget.
 */

import { join } from "node:path";

type FeatureExtractionPipeline = (
  texts: string[],
  options: { pooling: "mean"; normalize: boolean }
) => Promise<{ tolist(): number[][] }>;

const MODEL = "Xenova/multilingual-e5-small";

export const EMBEDDING_DIMENSIONS = 384;

let pipelinePromise: Promise<FeatureExtractionPipeline> | null = null;

function getPipeline(): Promise<FeatureExtractionPipeline> {
  if (pipelinePromise) return pipelinePromise;

  pipelinePromise = (async () => {
    const transformers = await import("@huggingface/transformers");

    // The default cache sits inside node_modules and dies with every
    // `npm ci`. A stable directory keeps the one-time 130 MB download
    // one-time; override for deployments with a dedicated data dir.
    transformers.env.cacheDir =
      process.env.AI_EMBEDDINGS_CACHE_DIR ||
      join(process.cwd(), ".model-cache");

    return (await transformers.pipeline("feature-extraction", MODEL, {
      // Quantized weights: a quarter of the memory, no measurable loss for
      // retrieval ranking.
      dtype: "q8",
    })) as unknown as FeatureExtractionPipeline;
  })();

  return pipelinePromise;
}

async function embed(texts: string[]): Promise<number[][]> {
  const pipeline = await getPipeline();
  const output = await pipeline(texts, { pooling: "mean", normalize: true });
  return output.tolist();
}

/** Embeds retrieval passages (chunk texts), in order. */
export function embedPassages(texts: string[]): Promise<number[][]> {
  return embed(texts.map((t) => `passage: ${t}`));
}

/** Embeds one search query. */
export async function embedQuery(text: string): Promise<number[]> {
  const [vector] = await embed([`query: ${text}`]);
  return vector;
}
