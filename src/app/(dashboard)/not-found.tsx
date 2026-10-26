import { getLang } from "@/lib/i18n/server";
import { CHROME } from "@/lib/i18n/chrome";
import { ButtonLink } from "@/components/ui/Button";
import ErrorScreen from "@/components/ui/ErrorScreen";

/**
 * `notFound()` from a dashboard page — an unknown topic or activity id —
 * lands here, inside the dashboard layout, so the navbar stays put.
 */
export default function DashboardNotFound() {
  const t = CHROME[getLang()];
  return (
    <ErrorScreen code="404" title={t.notFoundTitle} body={t.notFoundBody}>
      <ButtonLink href="/calendar">{t.toCalendar}</ButtonLink>
      <ButtonLink href="/" variant="secondary">
        {t.backHome}
      </ButtonLink>
    </ErrorScreen>
  );
}
