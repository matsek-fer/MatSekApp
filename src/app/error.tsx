"use client";

import { startTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  useEffect(() => {
    // The server already logged it with the same digest; this is for the
    // browser console, where the message is otherwise swallowed in production.
    console.error(error);
  }, [error]);

  // reset() alone re-renders the payload the server already sent, error
  // included; the refresh asks the server again, which is what a retry means
  // when the failure was in a Server Component.
  const retry = () =>
    startTransition(() => {
      router.refresh();
      reset();
    });

  return (
    <main className="min-h-screen bg-bg px-4">
      <ErrorScreen title={t.errorTitle} body={t.errorBody}>
        <Button onClick={retry}>{t.retry}</Button>
        <ButtonLink href="/" variant="secondary">
          {t.backHome}
        </ButtonLink>
      </ErrorScreen>
    </main>
  );
}
