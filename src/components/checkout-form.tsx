"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";

type CheckoutFormProps = {
  productSlug: string;
  productName: string;
  priceLabel: string;
};

export function CheckoutForm({
  productSlug,
  productName,
  priceLabel,
}: CheckoutFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerEmail: email,
          productSlug,
        }),
      });
      const data = (await response.json()) as {
        error?: string;
        invoiceUrl?: string;
      };
      if (!response.ok) {
        throw new Error(data.error ?? "Checkout failed");
      }
      if (data.invoiceUrl) {
        window.location.href = data.invoiceUrl;
        return;
      }
      throw new Error("Missing payment URL");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mt-8 flex w-full max-w-md flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
    >
      <input type="hidden" name="productSlug" value={productSlug} />
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        Checkout · {productName}
      </p>
      <div>
        <label
          htmlFor="checkout-email"
          className="text-sm font-medium text-zinc-200"
        >
          Email for receipts &amp; delivery
        </label>
        <input
          id="checkout-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-950/80 px-4 py-3 text-sm text-white outline-none ring-emerald-400/40 transition focus:border-emerald-400/50 focus:ring-2"
        />
      </div>
      {error ? (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-zinc-950 shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          <CreditCard className="h-4 w-4" aria-hidden />
        )}
        Buy now — {priceLabel}
      </button>
      <p className="text-center text-xs text-zinc-500">
        You will complete payment in crypto on the secure NOWPayments page.
      </p>
    </form>
  );
}
