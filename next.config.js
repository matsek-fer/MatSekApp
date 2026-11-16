/** @type {import('next').NextConfig} */
const nextConfig = {
  // The site runs from `node server.js` in a container (see Dockerfile);
  // Vercel ignores this and traces on its own.
  output: "standalone",
  // postgres.js v4 is an ES module that webpack emits as a static asset and
  // then fails to minify; required from node_modules at runtime instead,
  // which the standalone trace follows.
  serverExternalPackages: ["postgres"],
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // The site is never meant to be framed; this is the clickjacking
          // guard the auth cookie needs.
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // Two years, as the preload list requires; Caddy sends one too and
          // a duplicate is harmless.
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
