"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient as createBrowserClient } from "@/lib/supabase/client";
import AuthShell from "@/components/auth/AuthShell";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";

export default function VerifyPage() {
  const router = useRouter();
  const supabase = createBrowserClient();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "signup",
    });

    if (verifyError) {
      setError(verifyError.message);
      setLoading(false);
      return;
    }

    setSuccess("Email verificiran! Preusmjeravam na prijavu…");
    setTimeout(() => router.push("/login"), 2000);
  }

  return (
    <AuthShell
      subtitle="Verificiraj email"
      footer={
        <>
          Nemaš kod?{" "}
          <Link href="/register" className="text-brand hover:underline">
            Registriraj se
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
        <Input
          label="Verifikacijski kod"
          type="text"
          required
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="Unesi kod iz maila"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <Button type="submit" fullWidth disabled={loading || !!success}>
          {loading ? "Verificiram…" : "Verificiraj"}
        </Button>
      </form>
    </AuthShell>
  );
}
