import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { StoreChrome } from "@/components/store-chrome";
import { isSupabaseConfigured } from "@/lib/env";
import { formatProductPrice, listActiveProducts } from "@/lib/products";
import { getProductMainImageUrl } from "@/lib/public-assets";

export const dynamic = "force-dynamic";

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

  return (
    <StoreChrome>
      <div className="relative flex min-h-full flex-1 flex-col overflow-hidden bg-zinc-950 text-zinc-50">
        <div className="pointer-events-none absolute inset-0 opacity-80" aria-hidden>
          <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl" />
        </div>
        <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-6 py-14">
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Products
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-400">
            Browse all active products and open any listing for details, demo, and checkout.
          </p>
          {categoryFilter ? (
            <div className="mt-3 flex items-center gap-2">
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                Filter: {categoryFilter}
              </span>
              <Link href="/products" className="text-xs text-zinc-400 hover:text-emerald-300">
                Clear
              </Link>
            </div>
          ) : null}

          {!supabaseReady ? (
            <p className="mt-16 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-6 py-4 text-sm text-amber-200">
              Supabase is not configured.
            </p>
          ) : products.length === 0 ? (
            <p className="mt-16 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-6 py-4 text-sm text-amber-200">
              No active products found yet.
            </p>
          ) : (
            <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/products/${product.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:border-emerald-500/30 hover:bg-white/[0.06]"
                  >
                    {getProductMainImageUrl(product.main_image_path) ? (
                      <div className="relative h-40 w-full bg-zinc-800">
                        <Image
                          src={getProductMainImageUrl(product.main_image_path)!}
                          alt=""
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : null}
                    <div className="flex flex-1 flex-col p-6">
                      {product.category ? (
                        <p className="text-xs font-medium text-emerald-500/80">
                          {product.category.name}
                        </p>
                      ) : null}
                      <h2 className="text-xl font-semibold text-white group-hover:text-emerald-100">
                        {product.name}
                      </h2>
                      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-zinc-500">
                        {product.summary}
                      </p>
                      <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-4">
                        <span className="text-lg font-semibold text-emerald-400">
                          {formatProductPrice(product)}
                        </span>
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-zinc-400 transition group-hover:text-emerald-300">
                          View
                          <ArrowRight className="h-4 w-4" aria-hidden />
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
    </StoreChrome>
  );
}
