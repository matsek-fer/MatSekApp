import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import { getLang } from "@/lib/i18n/server";
import { CHROME } from "@/lib/i18n/chrome";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

export function generateMetadata(): Metadata {
  const t = CHROME[getLang()];
  return { title: t.siteTitle, description: t.siteDescription };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Read here, once, so <html lang> is right on the first paint; the
  // language toggle updates the attribute on the client between refreshes.
  const lang = getLang();

  return (
    <html lang={lang} className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Applies the saved theme before first paint to avoid a light flash. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
