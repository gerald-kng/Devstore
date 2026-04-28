import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Loader } from "lucide-react";
import { createOrderAccessLink } from "@/lib/access";
import { isSupabaseConfigured } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { getProductById } from "@/lib/products";
import { isUuid } from "@/lib/validation";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ orderId: string }>;
};

export default async function SuccessPage({ params }: PageProps) {
  const { orderId } = await params;

  if (!isUuid(orderId)) {
    notFound();
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-zinc-950 px-6 py-24 text-center text-amber-200">
        <p className="max-w-md text-sm">
          Supabase is not configured, so this page cannot load order data. Add
          the variables from <code className="text-amber-100/90">.env.example</code>{" "}
          to <code className="text-amber-100/90">.env.local</code>.
        </p>
      </div>
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
      <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-zinc-950 px-6 py-24 text-center text-zinc-50">
        <Loader className="mb-6 h-10 w-10 animate-spin text-emerald-400" />
        <h1 className="text-2xl font-semibold tracking-tight">
          Waiting for payment confirmation
        </h1>
        <p className="mt-3 max-w-md text-sm text-zinc-400">
          This page unlocks as soon as your crypto payment is confirmed. You can
          safely keep this tab open — download links appear here only after the
          order is marked paid in our database.
        </p>
        <p className="mt-6 text-xs text-zinc-600">
          {productLabel} · order{" "}
          <span className="font-mono text-zinc-500">{order.id}</span>
        </p>
        <Link
          href="/"
          className="mt-10 text-sm font-medium text-emerald-400 hover:text-emerald-300"
        >
          Back to catalog
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-zinc-950 px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold text-white">
          Payment verified — product unavailable
        </h1>
        <p className="mt-3 max-w-md text-sm text-zinc-400">
          This order is paid, but the catalog entry for the product is missing.
          Contact support with your order ID.
        </p>
        <p className="mt-6 font-mono text-xs text-zinc-600">{order.id}</p>
      </div>
    );
  }

  let accessPortalUrl: string;
  try {
    accessPortalUrl = await createOrderAccessLink(order.id);
  } catch {
    return (
      <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-zinc-950 px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold text-white">
          Payment verified — delivery temporarily unavailable
        </h1>
        <p className="mt-3 max-w-md text-sm text-zinc-400">
          Your order is paid, but we could not generate download links. Contact
          support with your order ID and we will resend access.
        </p>
        <p className="mt-6 font-mono text-xs text-zinc-600">{order.id}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-950 px-6 py-16 text-zinc-50">
      <div className="mx-auto w-full max-w-lg">
        <div className="mb-10 flex items-center gap-3 text-emerald-400">
          <CheckCircle2 className="h-10 w-10" aria-hidden />
          <div>
            <h1 className="text-2xl font-semibold text-white">
              {product.name}
            </h1>
            <p className="text-sm text-zinc-400">
              Verified order — your secure download portal is ready.
            </p>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            Access portal
          </p>
          <a
            href={accessPortalUrl}
            className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm font-medium text-white transition hover:border-emerald-500/40 hover:bg-zinc-900"
          >
            <span>Open your licensed downloads</span>
            <span className="text-xs text-zinc-500">Portal link</span>
          </a>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-600">
          Receipt sent to{" "}
          <span className="text-zinc-400">{order.customer_email}</span>
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

        <div className="mt-10 flex flex-col gap-3 text-center text-sm font-medium">
          <Link
            href={`/products/${product.slug}`}
            className="text-emerald-400 hover:text-emerald-300"
          >
            Back to {product.name}
          </Link>
          <Link href="/" className="text-zinc-500 hover:text-zinc-300">
            View all products
          </Link>
        </div>
      </div>
    </div>
  );
}
