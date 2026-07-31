"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient as createBrowserClient } from "@/lib/supabase/client";
import AuthShell from "@/components/auth/AuthShell";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { ALLOWED_EMAIL_DOMAINS, isAllowedEmail } from "@/lib/validation";

export default function RegisterPage() {
  const supabase = createBrowserClient();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!isAllowedEmail(email)) {
      setError(
        `Dozvoljene su samo ${ALLOWED_EMAIL_DOMAINS.join(" i ")} email adrese.`
      );
      setLoading(false);
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    setSuccess(
      "Registracija uspješna! Provjeri svoj inbox za verifikacijski kod."
    );
  }

  return (
    <AuthShell
      subtitle="Registriraj se"
      footer={
        <>
          Već imaš račun?{" "}
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
          label="Ime i prezime"
          type="text"
          required
          autoComplete="name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <Input
          label="Email"
          type="email"
          required
          autoComplete="email"
          placeholder="ime.prezime@fer.hr"
          hint={`Dozvoljeno: ${ALLOWED_EMAIL_DOMAINS.join(", ")}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Lozinka"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          hint="Najmanje 8 znakova."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" fullWidth disabled={loading}>
          {loading ? "Registracija…" : "Registriraj se"}
        </Button>
      </form>

      <p className="text-center text-sm text-fg-muted">
        Već si dobio/la kod?{" "}
        <Link href="/verify" className="text-brand hover:underline">
          Verificiraj email
        </Link>
      </p>
    </AuthShell>
  );
}
