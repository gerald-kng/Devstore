"use client";

import { useState } from "react";

export function SiteReviewForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/site-reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message, rating }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        throw new Error(json.error ?? "Could not submit review.");
      }
      setStatus("success");
      setEmail("");
      setMessage("");
      setRating(5);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not submit review.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-sm font-semibold text-white">Rate this website</p>
      <div className="mt-3 space-y-2">
        <input
          required
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500"
        />
        <div className="flex items-center gap-2">
          <label className="text-xs text-zinc-400">Rating</label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm text-zinc-100"
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} star{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>
        <textarea
          required
          minLength={5}
          rows={3}
          placeholder="Your review"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500"
        />
      </div>
      {status === "success" ? <p className="mt-2 text-xs text-emerald-400">Review sent.</p> : null}
      {status === "error" && error ? <p className="mt-2 text-xs text-red-400">{error}</p> : null}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-300 transition hover:border-emerald-400 hover:bg-emerald-500/20 disabled:opacity-60"
      >
        {status === "submitting" ? "Sending..." : "Submit review"}
      </button>
    </form>
  );
}
