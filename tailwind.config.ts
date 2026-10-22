import type { Config } from "tailwindcss";

/** Reads a token from globals.css, keeping Tailwind's `/opacity` modifier working. */
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // ── Semantic tokens (see src/app/globals.css) ──
        bg: token("bg"),
        surface: {
          DEFAULT: token("surface"),
          raised: token("surface-raised"),
          hover: token("surface-hover"),
        },
        fg: {
          DEFAULT: token("fg"),
          muted: token("fg-muted"),
          subtle: token("fg-subtle"),
        },
        border: {
          DEFAULT: token("border"),
          strong: token("border-strong"),
        },
        ring: token("ring"),
        mesh: token("mesh"),
        success: {
          DEFAULT: token("success"),
          bg: token("success-bg"),
          fg: token("success-fg"),
        },
        warning: {
          DEFAULT: token("warning"),
          bg: token("warning-bg"),
          fg: token("warning-fg"),
        },
        danger: {
          DEFAULT: token("danger"),
          bg: token("danger-bg"),
          fg: token("danger-fg"),
        },

        // ── Brand scale (fixed palette) ──
        brand: {
          DEFAULT: token("brand"),
          fg: token("brand-fg"),
          50: "#f0f4ff",
          100: "#dbe4ff",
          200: "#bac8ff",
          300: "#91a7ff",
          400: "#748ffc",
          500: "#5c7cfa",
          600: "#4c6ef5",
          700: "#4263eb",
          800: "#3b5bdb",
          900: "#364fc7",
        },
      },
      borderColor: {
        // `border` with no colour utility should mean the token, not gray-200.
        DEFAULT: token("border"),
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(-4px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        // Indeterminate bar: a third-width segment crossing a full-width track.
        progress: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(300%)" },
        },
      },
      animation: {
        // Dropdowns settle in place instead of sliding across the viewport.
        "fade-in-up": "fade-in-up 0.15s ease-out",
        progress: "progress 1.2s ease-in-out infinite",
      },
      // The plugin ships its own grey palette and a separate prose-invert for
      // dark backgrounds. Pointing its variables at the tokens instead makes
      // `prose` follow the .dark class like everything else, with no variant.
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-body": "rgb(var(--fg))",
            "--tw-prose-headings": "rgb(var(--fg))",
            "--tw-prose-lead": "rgb(var(--fg-muted))",
            "--tw-prose-links": "rgb(var(--brand))",
            "--tw-prose-bold": "rgb(var(--fg))",
            "--tw-prose-counters": "rgb(var(--fg-muted))",
            "--tw-prose-bullets": "rgb(var(--border-strong))",
            "--tw-prose-hr": "rgb(var(--border))",
            "--tw-prose-quotes": "rgb(var(--fg))",
            "--tw-prose-quote-borders": "rgb(var(--border))",
            "--tw-prose-captions": "rgb(var(--fg-muted))",
            "--tw-prose-kbd": "rgb(var(--fg))",
            "--tw-prose-kbd-shadows": "rgb(var(--fg) / 10%)",
            "--tw-prose-code": "rgb(var(--fg))",
            "--tw-prose-pre-code": "rgb(var(--fg))",
            "--tw-prose-pre-bg": "rgb(var(--surface-hover))",
            "--tw-prose-th-borders": "rgb(var(--border-strong))",
            "--tw-prose-td-borders": "rgb(var(--border))",
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config;
