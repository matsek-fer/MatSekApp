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
    // useSearchParams, which would want a Suspense boundary for one read.
    const next = new URLSearchParams(window.location.search).get("next");
    // Resolve it the way the router will and keep it only if it stays on this
    // origin. Checking the string instead is a losing game: "//evil.example"
    // and "/\\evil.example" are protocol-relative, and "/\t/evil.example"
    // becomes one once the URL parser strips the tab.
    let target = "/calendar";
    if (next) {
      try {
        const url = new URL(next, window.location.origin);
        if (url.origin === window.location.origin) {
          target = url.pathname + url.search + url.hash;
        }
      } catch {
        // Unparseable: fall through to the calendar.
      }
    }
    router.push(target);
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

        <p className="text-right text-sm">
          <Link
            href="/forgot-password"
            className="text-fg-muted hover:text-brand hover:underline"
          >
            Zaboravljena lozinka?
          </Link>
        </p>
        <Button type="submit" fullWidth disabled={loading}>
          {loading ? "Prijava…" : "Prijavi se"}
        </Button>
      </form>
    </AuthShell>
  );
}
