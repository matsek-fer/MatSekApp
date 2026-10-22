/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // pdfjs-dist is used server-side by the ingest route to extract text;
    // @huggingface/transformers embeds retrieval passages and loads
    // onnxruntime-node, a native binary. Bundling either breaks them — both
    // are required from node_modules at runtime instead.
    serverComponentsExternalPackages: ["pdfjs-dist", "@huggingface/transformers"],
  },
};

module.exports = nextConfig;
