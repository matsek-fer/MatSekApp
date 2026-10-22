"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient as createBrowserClient } from "@/lib/supabase/client";
import AuthShell from "@/components/auth/AuthShell";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";

const MIN_PASSWORD = 8;

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createBrowserClient();

  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Supabase's recovery mail can carry either a code or a link, depending on
  // which template the project has configured. A link lands back here with the
  // session already in the URL, which the client picks up and reports as
  // PASSWORD_RECOVERY — at that point ownership is proven and asking for the
  // code again would be asking for something the user never received.
  const [viaLink, setViaLink] = useState(false);
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setViaLink(true);
    });
    if (window.location.hash.includes("type=recovery")) setViaLink(true);
    return () => data.subscription.unsubscribe();
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < MIN_PASSWORD) {
      setError(`Lozinka mora imati barem ${MIN_PASSWORD} znakova.`);
      return;
    }
    if (password !== confirm) {
      setError("Lozinke se ne podudaraju.");
      return;
    }

    setLoading(true);

    // The code has to be redeemed first: it is what proves the mailbox belongs
    // to whoever is typing, and it is the session it creates that authorises
    // the password change below.
    if (!viaLink) {
      const { error: otpError } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: token.trim(),
        type: "recovery",
      });

      if (otpError) {
        setError(otpError.message);
        setLoading(false);
        return;
      }
    }

    const { error: updateError } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess("Lozinka promijenjena! Preusmjeravam…");
    setTimeout(() => {
      router.push("/calendar");
      router.refresh();
    }, 1500);
  }

  return (
    <AuthShell
      subtitle="Nova lozinka"
      footer={
        <>
          Nemaš kod?{" "}
          <Link href="/forgot-password" className="text-brand hover:underline">
            Pošalji ponovno
          </Link>
        </>
      }
    >
      <Alert tone="error">{error}</Alert>
      <Alert tone="success">{success}</Alert>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!viaLink && (
          <>
            <Input
              label="Email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Kod iz maila"
              type="text"
              required
              inputMode="numeric"
              autoComplete="one-time-code"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </>
        )}

        <Input
          label="Nova lozinka"
          type="password"
          required
          minLength={MIN_PASSWORD}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          label="Ponovi novu lozinku"
          type="password"
          required
          minLength={MIN_PASSWORD}
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? "Spremam…" : "Postavi lozinku"}
        </Button>
      </form>
    </AuthShell>
  );
}
