"use client";

import { useEffect } from "react";
import { CHROME } from "@/lib/i18n/chrome";
import { useDocumentLang } from "@/lib/i18n/client";
import Button, { ButtonLink } from "@/components/ui/Button";
import ErrorScreen from "@/components/ui/ErrorScreen";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = CHROME[useDocumentLang()];

  useEffect(() => {
    // The server already logged it with the same digest; this is for the
    // browser console, where the message is otherwise swallowed in production.
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-bg px-4">
      <ErrorScreen title={t.errorTitle} body={t.errorBody}>
        <Button onClick={reset}>{t.retry}</Button>
        <ButtonLink href="/" variant="secondary">
          {t.backHome}
        </ButtonLink>
      </ErrorScreen>
    </main>
  );
}
