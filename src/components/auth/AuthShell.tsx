import Logo from "@/components/ui/Logo";
import Card from "@/components/ui/Card";

/** Centred card layout shared by the login, register and verify screens. */
export default function AuthShell({
  subtitle,
  children,
  footer,
}: {
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg p-4">
      <Card className="w-full max-w-md space-y-6 p-8">
        <div className="flex flex-col items-center text-center">
          <Logo width={224} />
          <h1 className="mt-3 text-sm font-medium text-fg-muted">{subtitle}</h1>
        </div>

        {children}

        {footer && (
          <p className="text-center text-sm text-fg-muted">{footer}</p>
        )}
      </Card>
    </main>
  );
}
