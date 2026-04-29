import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, GraduationCap, Sparkles } from "lucide-react";
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
  title: "Courses",
  description:
    "Hands-on technical and product courses available as digital downloads with instant delivery.",
  path: "/courses",
});

export default async function CoursesPage() {
  const supabaseReady = isSupabaseConfigured();
  const allProducts = supabaseReady ? await listActiveProducts() : [];
  const courses = allProducts.filter((p) => {
    const slug = p.category?.slug?.toLowerCase() ?? "";
    const name = p.category?.name?.toLowerCase() ?? "";
    return slug.includes("course") || name.includes("course");
  });

  const coursesItemList =
    courses.length > 0
      ? itemListLd(courses.map((p) => ({ name: p.name, slug: p.slug })))
      : null;

  return (
    <StoreChrome>
      {coursesItemList ? <JsonLd id="ld-courses-itemlist" data={coursesItemList} /> : null}
      <div className="relative isolate flex min-h-full flex-1 flex-col overflow-hidden bg-zinc-950 text-zinc-50">
        <PageBackdrop variant="default" />

        <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-6 pt-16 pb-20 sm:pt-20">
          <div className="max-w-3xl">
            <div
              className="hero-rise inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/[0.08] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-300 backdrop-blur"
              style={{ animationDelay: "0ms" }}
            >
              <GraduationCap className="h-3.5 w-3.5" aria-hidden />
              Knowledge Library
              <Sparkles className="h-3 w-3 text-emerald-300/80" aria-hidden />
            </div>
            <h1
              className="hero-rise mt-5 text-4xl font-semibold tracking-tight text-white sm:text-6xl"
              style={{ animationDelay: "120ms" }}
            >
              Learn by <span className="hero-shimmer">building</span>.
            </h1>
            <p
              className="hero-rise mt-5 max-w-2xl text-lg leading-relaxed text-zinc-400"
              style={{ animationDelay: "240ms" }}
            >
              Hands-on technical and product courses delivered instantly after
              checkout. Stream the install video, download the bundle, ship.
            </p>
          </div>

          <div className="mt-10 section-hairline hero-glow-breathe" />

          {!supabaseReady ? (
            <div className="reveal mt-12 glass-card border-amber-500/30 bg-amber-500/10 p-6 text-sm text-amber-100">
              Supabase is not configured.
            </div>
          ) : courses.length === 0 ? (
            <div className="reveal mt-12 glass-card border-amber-500/30 bg-amber-500/10 p-6 text-sm text-amber-100">
              <p>No course products found yet.</p>
              <Link
                href="/products"
                className="link-underline mt-3 inline-flex text-emerald-300 hover:text-emerald-200"
              >
                Browse all products
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
          ) : (
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((product, i) => (
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
                Want a deeper dive?{" "}
                <span className="hero-shimmer">Explore the full catalog.</span>
              </>
            }
            description="Beyond courses, our marketplace ships tools, bots, and dashboards ready to drop into your stack."
            actions={[
              { href: "/products", label: "Browse products", variant: "primary", icon: "right" },
              { href: "/contact", label: "Talk to us", variant: "secondary", icon: "upRight" },
            ]}
          />
        </main>
      </div>
    </StoreChrome>
  );
}
