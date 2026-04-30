"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getClientAuthRedirectBaseUrl } from "@/lib/env";

function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const err = searchParams.get("error");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const base = getClientAuthRedirectBaseUrl();
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${base}/auth/callback?next=/admin`,
        },
      });
      if (error) {
        setMsg(error.message);
      } else {
        setMsg("Check your email for the login link.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-zinc-950 px-6 py-20">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-xl font-semibold text-white">Admin sign in</h1>
        {err ? (
          <p className="text-sm text-red-400">Authentication failed. Try again.</p>
        ) : null}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="text-sm text-zinc-400">
              Work email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="mt-1 text-xs text-zinc-600">
              Your email must be in <code className="text-zinc-500">ADMIN_EMAILS</code> in
              the server environment.
            </p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-500 py-2 text-sm font-medium text-zinc-950 disabled:opacity-50"
          >
            {loading ? "Sending link…" : "Send magic link"}
          </button>
        </form>
        {msg ? <p className="text-sm text-emerald-200">{msg}</p> : null}
        <a
          href="/"
          className="block text-center text-sm text-zinc-500 hover:text-zinc-300"
        >
          ← Storefront
        </a>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-full flex-1 items-center justify-center bg-zinc-950 px-6 py-20 text-zinc-500">
          Loading…
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
