import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, CheckCircle2, Loader, Sparkles } from "lucide-react";
import { PageBackdrop } from "@/components/page-backdrop";
import { createOrderAccessLink } from "@/lib/access";
import { isSupabaseConfigured } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { getProductById } from "@/lib/products";
import { isUuid } from "@/lib/validation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order confirmation",
  robots: { index: false, follow: false },
};

type PageProps = {
  params: Promise<{ orderId: string }>;
};

function StateShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate flex min-h-full flex-1 flex-col overflow-hidden bg-zinc-950 px-6 py-24 text-zinc-50">
      <PageBackdrop variant="default" />
      <div className="relative z-10 mx-auto w-full max-w-xl">{children}</div>
    </div>
  );
}

export default async function SuccessPage({ params }: PageProps) {
  const { orderId } = await params;

  if (!isUuid(orderId)) {
    notFound();
  }

  if (!isSupabaseConfigured()) {
    return (
      <StateShell>
        <div className="reveal glass-card p-6 text-center text-sm text-amber-100">
          Supabase is not configured, so this page cannot load order data. Add
          the variables from <code className="text-amber-200/90">.env.example</code>{" "}
          to <code className="text-amber-200/90">.env.local</code>.
        </div>
      </StateShell>
    );
  }

  const supabase = createAdminClient();
  const { data: order, error } = await supabase
    .from("orders")
    .select("id, status, customer_email, paid_at, product_id")
    .eq("id", orderId)
    .maybeSingle();

  if (error || !order) {
    notFound();
  }

  const product = await getProductById(order.product_id);
  const productLabel = product?.name ?? "Your purchase";

  if (order.status !== "paid") {
    return (
      <StateShell>
        <div className="reveal glass-card flex flex-col items-center p-10 text-center">
          <Loader className="mb-6 h-10 w-10 animate-spin text-emerald-400" />
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Waiting for payment confirmation
          </h1>
          <p className="mt-3 max-w-md text-sm text-zinc-400">
            This page unlocks as soon as your crypto payment is confirmed. Keep
            this tab open — download links appear here only after the order is
            marked paid in our database.
          </p>
          <p className="mt-6 text-xs text-zinc-500">
            {productLabel} · order{" "}
            <span className="font-mono text-zinc-400">{order.id}</span>
          </p>
          <Link
            href="/"
            className="link-underline mt-10 text-sm font-medium text-emerald-300 hover:text-emerald-200"
          >
            Back to catalog
          </Link>
        </div>
      </StateShell>
    );
  }

  if (!product) {
    return (
      <StateShell>
        <div className="reveal glass-card p-8 text-center">
          <h1 className="text-2xl font-semibold text-white">
            Payment verified — product unavailable
          </h1>
          <p className="mt-3 text-sm text-zinc-400">
            This order is paid, but the catalog entry for the product is missing.
            Contact support with your order ID.
          </p>
          <p className="mt-6 font-mono text-xs text-zinc-500">{order.id}</p>
        </div>
      </StateShell>
    );
  }

  let accessPortalUrl: string;
  try {
    accessPortalUrl = await createOrderAccessLink(order.id);
  } catch {
    return (
      <StateShell>
        <div className="reveal glass-card p-8 text-center">
          <h1 className="text-2xl font-semibold text-white">
            Payment verified — delivery temporarily unavailable
          </h1>
          <p className="mt-3 text-sm text-zinc-400">
            Your order is paid, but we could not generate download links.
            Contact support with your order ID and we will resend access.
          </p>
          <p className="mt-6 font-mono text-xs text-zinc-500">{order.id}</p>
        </div>
      </StateShell>
    );
  }

  return (
    <StateShell>
      <div
        className="hero-rise inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/[0.08] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-300 backdrop-blur"
        style={{ animationDelay: "0ms" }}
      >
        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
        Order confirmed
        <Sparkles className="h-3 w-3 text-emerald-300/80" aria-hidden />
      </div>

      <h1
        className="hero-rise mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl"
        style={{ animationDelay: "120ms" }}
      >
        {product.name}
      </h1>
      <p
        className="hero-rise mt-3 text-sm text-zinc-400"
        style={{ animationDelay: "240ms" }}
      >
        Verified order — your secure download portal is ready.
      </p>

      <div className="reveal mt-10 glass-card card-glow p-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-300/80">
          Access portal
        </p>
        <a
          href={accessPortalUrl}
          className="group mt-3 flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-3 text-sm font-medium text-white transition hover:border-emerald-400/50 hover:bg-zinc-900"
        >
          <span>Open your licensed downloads</span>
          <ArrowUpRight
            className="h-4 w-4 text-emerald-300 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden
          />
        </a>
        <p className="mt-4 text-xs text-zinc-500">
          Receipt sent to{" "}
          <span className="text-zinc-300">{order.customer_email}</span>
          {order.paid_at ? (
            <>
              {" "}
              · Paid{" "}
              {new Intl.DateTimeFormat(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(new Date(order.paid_at))}
            </>
          ) : null}
        </p>
      </div>

      <div className="reveal mt-10 flex flex-col gap-3 text-center text-sm font-medium">
        <Link
          href={`/products/${product.slug}`}
          className="link-underline mx-auto inline-flex text-emerald-300 hover:text-emerald-200"
        >
          Back to {product.name}
        </Link>
        <Link
          href="/"
          className="link-underline mx-auto inline-flex text-zinc-500 hover:text-zinc-300"
        >
          View all products
        </Link>
      </div>
    </StateShell>
  );
}
