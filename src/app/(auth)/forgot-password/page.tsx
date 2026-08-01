"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient as createBrowserClient } from "@/lib/supabase/client";
import AuthShell from "@/components/auth/AuthShell";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";

export default function ForgotPasswordPage() {
  const supabase = createBrowserClient();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim()
    );

    setLoading(false);

    // Supabase does not distinguish a missing account here, and neither do we:
    // a form that answers differently for a registered address hands out a
    // membership list to anyone willing to type.
    if (resetError) {
      setError(resetError.message);
      return;
    }

    setSuccess(
      "Ako račun s tom adresom postoji, poslali smo kod za promjenu lozinke. " +
        "Provjeri inbox."
    );
  }

  return (
    <AuthShell
      subtitle="Zaboravljena lozinka"
      footer={
        <>
          Sjetio si se?{" "}
          <Link href="/login" className="text-brand hover:underline">
            Prijavi se
          </Link>
        </>
      }
    >
      <Alert tone="error">{error}</Alert>
      <Alert tone="success">{success}</Alert>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? "Šaljem…" : "Pošalji kod"}
        </Button>
      </form>

      {success && (
        <p className="text-center text-sm text-fg-muted">
          Kod stigao?{" "}
          <Link href="/reset-password" className="text-brand hover:underline">
            Postavi novu lozinku
          </Link>
        </p>
      )}
    </AuthShell>
  );
}
