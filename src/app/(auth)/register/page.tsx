"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient as createBrowserClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
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

    if (!email.endsWith("@fer.hr") && !email.endsWith("@student.fer.hr")) {
      setError("Dozvoljene su samo @fer.hr i @student.fer.hr email adrese.");
      setLoading(false);
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    setSuccess(
      "Registracija uspješna! Provjeri svoj inbox za verifikacijski mail."
    );
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg border p-8 space-y-6">
        <div className="text-center">
          <Image
            src="/logo.png"
            alt="MATSEK — Matematička sekcija"
            width={240}
            height={90}
            className="h-auto w-60 mx-auto mb-3"
            priority
            unoptimized
          />
          <p className="text-gray-500 mt-1">Registriraj se</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ime i prezime
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email (@fer.hr ili @student.fer.hr)
            </label>
            <input
              type="email"
              required
              placeholder="ime.prezime@fer.hr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lozinka (min. 8 znakova)
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-brand-600 text-white rounded-lg
                       hover:bg-brand-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Registracija..." : "Registriraj se"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Već imaš račun?{" "}
          <a href="/login" className="text-brand-600 hover:underline">
            Prijavi se
          </a>
        </p>
      </div>
    </div>
  );
}
