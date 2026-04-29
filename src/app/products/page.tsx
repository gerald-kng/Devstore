import type { Metadata } from "next";
import Link from "next/link";
import { Boxes, Sparkles, X } from "lucide-react";
import { CtaBanner } from "@/components/cta-banner";
import { JsonLd } from "@/components/json-ld";
import { PageBackdrop } from "@/components/page-backdrop";
import { ProductCard } from "@/components/product-card";
import { StoreChrome } from "@/components/store-chrome";
import { isSupabaseConfigured } from "@/lib/env";
import { listActiveProducts } from "@/lib/products";
import { buildMetadata, itemListLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Products",
  description:
    "Browse all active digital products in Orion Dev Store. Filter by category and open any listing for details, demo, and crypto checkout.",
  path: "/products",
});

type ProductsPageProps = {
  searchParams: Promise<{ category?: string }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category } = await searchParams;
  const supabaseReady = isSupabaseConfigured();
  const allProducts = supabaseReady ? await listActiveProducts() : [];
  const categoryFilter = category?.trim().toLowerCase() ?? "";
  const products =
    categoryFilter.length < 1
      ? allProducts
      : allProducts.filter((p) => {
          const categorySlug = p.category?.slug?.toLowerCase() ?? "";
          const categoryName = p.category?.name?.toLowerCase() ?? "";
          return (
            categorySlug === categoryFilter ||
            categoryName === categoryFilter ||
            categorySlug.includes(categoryFilter) ||
            categoryName.includes(categoryFilter)
          );
        });

  const productListLd =
    products.length > 0
      ? itemListLd(products.map((p) => ({ name: p.name, slug: p.slug })))
      : null;

  return (
    <StoreChrome>
      {productListLd ? <JsonLd id="ld-products-itemlist" data={productListLd} /> : null}
      <div className="relative isolate flex min-h-full flex-1 flex-col overflow-hidden bg-zinc-950 text-zinc-50">
        <PageBackdrop variant="default" />

        <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-6 pt-16 pb-20 sm:pt-20">
          <div className="max-w-3xl">
            <div
              className="hero-rise inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/[0.08] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-300 backdrop-blur"
              style={{ animationDelay: "0ms" }}
            >
              <Boxes className="h-3.5 w-3.5" aria-hidden />
              Marketplace
              <Sparkles className="h-3 w-3 text-emerald-300/80" aria-hidden />
            </div>
            <h1
              className="hero-rise mt-5 text-4xl font-semibold tracking-tight text-white sm:text-6xl"
              style={{ animationDelay: "120ms" }}
            >
              Every <span className="hero-shimmer">digital tool</span> we ship.
            </h1>
            <p
              className="hero-rise mt-5 max-w-2xl text-lg leading-relaxed text-zinc-400"
              style={{ animationDelay: "240ms" }}
            >
              Browse all active products and open any listing for details, demo,
              and checkout.
            </p>
            {categoryFilter ? (
              <div
                className="hero-rise mt-5 flex flex-wrap items-center gap-2"
                style={{ animationDelay: "320ms" }}
              >
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {categoryFilter}
                </span>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-zinc-400 transition hover:border-emerald-500/30 hover:text-emerald-200"
                >
                  <X className="h-3 w-3" aria-hidden />
                  Clear filter
                </Link>
              </div>
            ) : null}
          </div>

          <div className="mt-10 section-hairline hero-glow-breathe" />

          {!supabaseReady ? (
            <div className="reveal mt-12 glass-card border-amber-500/30 bg-amber-500/10 p-6 text-sm text-amber-100">
              Supabase is not configured.
            </div>
          ) : products.length === 0 ? (
            <div className="reveal mt-12 glass-card border-amber-500/30 bg-amber-500/10 p-6 text-sm text-amber-100">
              No active products found yet.
            </div>
          ) : (
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product, i) => (
                <li key={product.id}>
                  <ProductCard product={product} delayMs={(i % 6) * 80} />
                </li>
              ))}
            </ul>
          )}

          <CtaBanner
            className="mt-24"
            title={
              <>
                Can&apos;t find what you need?{" "}
                <span className="hero-shimmer">We&apos;ll build it.</span>
              </>
            }
            description="Tell us about your stack and use case — we ship custom toolkits, bots, and dashboards on request."
            actions={[
              { href: "/contact", label: "Talk to us", variant: "primary", icon: "right" },
              { href: "/courses", label: "View courses", variant: "secondary", icon: "upRight" },
            ]}
          />
        </main>
      </div>
    </StoreChrome>
  );
}
