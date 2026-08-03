/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // pdfjs-dist is used server-side by the ingest route to extract text.
    // Bundling it breaks its worker resolution and its reliance on Node
    // built-ins, so it is required from node_modules at runtime instead.
    serverComponentsExternalPackages: ["pdfjs-dist"],
  },
};

module.exports = nextConfig;
