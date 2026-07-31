"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient as createBrowserClient } from "@/lib/supabase/client";
import AuthShell from "@/components/auth/AuthShell";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createBrowserClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
      return;
    }

    // Middleware parks the original destination on `?next=` when it bounces an
    // unauthenticated request here. Read it off the URL rather than with
    // useSearchParams so this page can stay statically rendered.
    const next = new URLSearchParams(window.location.search).get("next");
    router.push(next?.startsWith("/") ? next : "/calendar");
    router.refresh();
  }

  return (
    <AuthShell
      subtitle="Prijavi se"
      footer={
        <>
          Nemaš račun?{" "}
          <Link href="/register" className="text-brand hover:underline">
            Registriraj se
          </Link>
        </>
      }
    >
      <Alert tone="error">{error}</Alert>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email (@fer.hr)"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Lozinka"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" fullWidth disabled={loading}>
          {loading ? "Prijava…" : "Prijavi se"}
        </Button>
      </form>
    </AuthShell>
  );
}
