"use client";

import { useState } from "react";

export function AccessLinkRequestForm() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      await fetch("/api/access/request-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, email }),
      });
      setStatus("done");
    } catch {
      setStatus("done");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-sm font-medium text-zinc-200">Resend access link</p>
      <input
        type="text"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        placeholder="Order ID"
        className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Purchase email"
        className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
        required
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded bg-emerald-500 px-3 py-2 text-sm font-medium text-zinc-950 disabled:opacity-60"
      >
        {status === "sending" ? "Sending..." : "Request link"}
      </button>
      {status === "done" ? (
        <p className="text-xs text-zinc-500">
          If your order is valid and paid, a login link has been sent.
        </p>
      ) : null}
    </form>
  );
}
