import { getLang } from "@/lib/i18n/server";
import { CHROME } from "@/lib/i18n/chrome";
import { ButtonLink } from "@/components/ui/Button";
import ErrorScreen from "@/components/ui/ErrorScreen";

/** Unmatched URLs outside the dashboard — there is no navbar to show here. */
export default async function NotFound() {
  const t = CHROME[await getLang()];
  return (
    <main className="min-h-screen bg-bg px-4">
      <ErrorScreen code="404" title={t.notFoundTitle} body={t.notFoundBody}>
        <ButtonLink href="/">{t.backHome}</ButtonLink>
        <ButtonLink href="/calendar" variant="secondary">
          {t.toCalendar}
        </ButtonLink>
      </ErrorScreen>
    </main>
  );
}
