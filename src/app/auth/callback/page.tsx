"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function safeNext(path: string | null): string {
  const fallback = "/admin";
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return fallback;
  }
  return path;
}

function AuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const run = async () => {
      const next = safeNext(searchParams.get("next"));

      const hash =
        typeof window !== "undefined" && window.location.hash.length > 1
          ? new URLSearchParams(window.location.hash.slice(1))
          : null;
      const errCode =
        searchParams.get("error_code") ?? hash?.get("error_code") ?? null;
      const errDesc =
        searchParams.get("error_description") ??
        hash?.get("error_description") ??
        null;
      if (searchParams.get("error") || errCode) {
        const q = new URLSearchParams();
        q.set("error", "callback");
        if (errCode) q.set("reason", errCode);
        if (errDesc) q.set("details", errDesc);
        router.replace(`/admin/login?${q.toString()}`);
        return;
      }

      const code = searchParams.get("code");
      if (!code) {
        router.replace("/admin/login?error=callback&reason=missing_code");
        return;
      }

      const lockKey = `sb_pkce_${code}`;
      const lock = sessionStorage.getItem(lockKey);
      if (lock === "done") {
        router.replace(next);
        return;
      }
      if (lock === "pending") {
        return;
      }
      sessionStorage.setItem(lockKey, "pending");

      const supabase = createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        sessionStorage.removeItem(lockKey);
        const q = new URLSearchParams();
        q.set("error", "callback");
        q.set("reason", "exchange_failed");
        if (error.message) q.set("details", error.message);
        router.replace(`/admin/login?${q.toString()}`);
        return;
      }

      sessionStorage.setItem(lockKey, "done");
      router.replace(next);
    };
    void run();
  }, [router, searchParams]);

  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-zinc-950 px-6 text-zinc-400">
      <p className="text-sm">Signing you in…</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-full flex-1 items-center justify-center bg-zinc-950 px-6 text-zinc-500">
          Loading…
        </div>
      }
    >
      <AuthCallbackInner />
    </Suspense>
  );
}
