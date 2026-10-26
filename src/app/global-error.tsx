"use client";

import { startTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";
import "./globals.css";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import { CHROME } from "@/lib/i18n/chrome";
import { useDocumentLang } from "@/lib/i18n/client";
import Button, { ButtonLink } from "@/components/ui/Button";
import ErrorScreen from "@/components/ui/ErrorScreen";

const inter = Inter({ subsets: ["latin", "latin-ext"], display: "swap" });

/**
 * Only reached when the root layout itself throws, which replaces the whole
 * document — so this renders its own <html> and <body>, with the same theme
 * script as the layout so the crash screen does not flash light.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const lang = useDocumentLang();
  const t = CHROME[lang];
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  const retry = () =>
    startTransition(() => {
      router.refresh();
      reset();
    });

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className={inter.className}>
        <main className="min-h-screen bg-bg px-4">
          <ErrorScreen title={t.errorTitle} body={t.errorBody}>
            <Button onClick={retry}>{t.retry}</Button>
            <ButtonLink href="/" variant="secondary">
              {t.backHome}
            </ButtonLink>
          </ErrorScreen>
        </main>
      </body>
    </html>
  );
}
