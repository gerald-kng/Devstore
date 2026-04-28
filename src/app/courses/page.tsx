import Image from "next/image";
import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";
import { StoreChrome } from "@/components/store-chrome";
import { isSupabaseConfigured } from "@/lib/env";
import { formatProductPrice, listActiveProducts } from "@/lib/products";
import { getProductMainImageUrl } from "@/lib/public-assets";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const supabaseReady = isSupabaseConfigured();
  const allProducts = supabaseReady ? await listActiveProducts() : [];
  const courses = allProducts.filter((p) => {
    const slug = p.category?.slug?.toLowerCase() ?? "";
    const name = p.category?.name?.toLowerCase() ?? "";
    return slug.includes("course") || name.includes("course");
  });

  return (
    <StoreChrome>
      <div className="relative flex min-h-full flex-1 flex-col overflow-hidden bg-zinc-950 text-zinc-50">
        <div className="pointer-events-none absolute inset-0 opacity-80" aria-hidden>
          <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl" />
        </div>
        <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-6 py-14">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-emerald-400" aria-hidden />
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Courses
            </h1>
          </div>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-400">
            Explore course products and learning bundles available in the store.
          </p>

          {!supabaseReady ? (
            <p className="mt-16 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-6 py-4 text-sm text-amber-200">
              Supabase is not configured.
            </p>
          ) : courses.length === 0 ? (
            <div className="mt-16 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-6 py-5 text-sm text-amber-200">
              <p>No course products found yet.</p>
              <Link href="/products" className="mt-3 inline-flex text-emerald-300 hover:text-emerald-200">
                Browse all products
              </Link>
            </div>
          ) : (
            <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((product) => (
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
