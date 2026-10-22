/**
 * Puts pdf.js's worker where the browser can fetch it.
 *
 *   node scripts/copy-pdf-worker.mjs
 *
 * The reader renders PDFs on a worker thread so a 300-page document does not
 * freeze the page. That worker cannot be imported the usual way: it ships as
 * an ES module and Next's compiler refuses to parse `import.meta` inside the
 * bundle, so it is served as a static file from /public instead.
 *
 * It is COPIED FROM node_modules on every dev and build rather than committed,
 * because a worker whose version has drifted from the library that loads it
 * fails at runtime, in the browser, on documents that used to work.
 */
import { copyFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const packageJson = require.resolve("pdfjs-dist/package.json");
const source = join(dirname(packageJson), "build", "pdf.worker.min.mjs");
const destination = join(process.cwd(), "public", "pdf.worker.min.mjs");

mkdirSync(dirname(destination), { recursive: true });
copyFileSync(source, destination);

console.log(`pdf.js worker → ${destination}`);
