"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { postAuth } from "@/lib/auth/client";
import AuthShell from "@/components/auth/AuthShell";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";

const MIN_PASSWORD = 8;

export default function ResetPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

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

    // One request: the route redeems the code and sets the password in the
    // same transaction, and signs this browser in on success.
    const { error: resetError } = await postAuth("reset-password", {
      email: email.trim(),
      token: token.trim(),
      password,
    });

    setLoading(false);

    if (resetError) {
      setError(resetError);
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
