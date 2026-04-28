"use client";

import { useState } from "react";

export function ProductCommentForm({ productSlug }: { productSlug: string }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/product-comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productSlug, email, message }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        throw new Error(json.error ?? "Could not submit comment.");
      }
      setStatus("success");
      setEmail("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not submit comment.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-sm font-semibold text-white">Leave a comment</p>
      <div className="mt-3 space-y-2">
        <input
          required
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500"
        />
        <textarea
          required
          minLength={5}
          rows={4}
          placeholder="Your comment"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500"
        />
      </div>
      {status === "success" ? <p className="mt-2 text-xs text-emerald-400">Comment sent.</p> : null}
      {status === "error" && error ? <p className="mt-2 text-xs text-red-400">{error}</p> : null}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-300 transition hover:border-emerald-400 hover:bg-emerald-500/20 disabled:opacity-60"
      >
        {status === "submitting" ? "Sending..." : "Post comment"}
      </button>
    </form>
  );
}
