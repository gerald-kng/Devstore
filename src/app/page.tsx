import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { CtaBanner } from "@/components/cta-banner";
import { JsonLd } from "@/components/json-ld";
import { ProductCard } from "@/components/product-card";
import { StoreChrome } from "@/components/store-chrome";
import { isSupabaseConfigured } from "@/lib/env";
import { listActiveProducts } from "@/lib/products";
import { buildMetadata, itemListLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: `Buy and Deliver digital products with confidence`,
  description:
    "Orion Dev Store gives customers smooth checkout, secure delivery links, and a polished product experience from discovery to download.",
  path: "/",
});

export default async function HomePage() {
  const supabaseReady = isSupabaseConfigured();
  const products = supabaseReady ? await listActiveProducts() : [];
  const featured = products.slice(0, 3);
  const featuredItemList = itemListLd(
    featured.map((p) => ({ name: p.name, slug: p.slug })),
  );
  const showItemList = featured.length > 0;
  const categoryCards = [
    {
      title: "Trading Tools",
      subtitle: "Dashboards, indicators, and bot helpers.",
      slug: "trading-tools",
      image: "https://picsum.photos/seed/trading-tools/1200/800",
    },
    {
      title: "Automation Bots",
      subtitle: "Workflow bots and task automation utilities.",
      slug: "automation-bots",
      image:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Courses",
      subtitle: "Hands-on technical and product courses.",
      slug: "courses",
      image:
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Staking & Yield",
      subtitle: "Tools for portfolio tracking and yield insights.",
      slug: "staking-yield",
      image:
        "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Custom Web Apps",
      subtitle: "Tailored web interfaces for specific use cases.",
      slug: "custom-web-apps",
      image:
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Security Utilities",
      subtitle: "Defensive tooling, audits, and hardening kits.",
      slug: "security-utilities",
      image:
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  const heroFeatures = [
    {
      icon: ShieldCheck,
      title: "Secure checkout",
      body: "Payments are verified before access is granted.",
    },
    {
      icon: Zap,
      title: "Instant delivery",
      body: "Customers get access links immediately after successful payment.",
    },
    {
      icon: CheckCircle2,
      title: "Admin control",
      body: "Manage products, categories, and content from one dashboard.",
    },
  ];

  const sparkles = [
    { left: "12%", top: "62%", delay: "0s",   duration: "6s" },
    { left: "22%", top: "38%", delay: "1.2s", duration: "7s" },
    { left: "38%", top: "78%", delay: "2.4s", duration: "5.5s" },
    { left: "55%", top: "30%", delay: "0.8s", duration: "6.5s" },
    { left: "68%", top: "70%", delay: "3.1s", duration: "7.5s" },
    { left: "82%", top: "44%", delay: "1.8s", duration: "6s" },
    { left: "92%", top: "60%", delay: "2.6s", duration: "5.8s" },
  ];

  return (
    <StoreChrome>
      {showItemList ? <JsonLd id="ld-home-itemlist" data={featuredItemList} /> : null}
      <div className="relative flex min-h-full flex-1 flex-col bg-zinc-950 text-zinc-50">
        <section className="relative isolate overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
            <div className="absolute inset-0 hero-grid opacity-70" />
            <div className="absolute -inset-[30%] hero-conic opacity-60" />
            <div
              className="hero-orb hero-orb-a absolute -left-24 -top-32 h-[36rem] w-[36rem] rounded-full bg-emerald-500/30 blur-[140px]"
            />
            <div
              className="hero-orb hero-orb-b absolute -bottom-40 right-[-6rem] h-[32rem] w-[32rem] rounded-full bg-cyan-500/25 blur-[140px]"
            />
            <div
              className="hero-orb hero-orb-c absolute top-24 right-1/3 h-72 w-72 rounded-full bg-violet-500/25 blur-[110px]"
            />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent hero-glow-breathe" />
            {sparkles.map((s, i) => (
              <span
                key={i}
                className="hero-spark"
                style={{
                  left: s.left,
                  top: s.top,
                  animationDelay: s.delay,
                  animationDuration: s.duration,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-20 pb-24 sm:pt-24 sm:pb-28">
            <div className="max-w-3xl">
              <div
                className="hero-rise inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/[0.08] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-300 backdrop-blur"
                style={{ animationDelay: "0ms" }}
              >
                <span className="relative flex h-2 w-2 items-center justify-center">
                  <span className="hero-pulse-ring absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300" />
                </span>
                Digital Product Marketplace
                <Sparkles className="h-3 w-3 text-emerald-300/80" aria-hidden />
              </div>

              <h1
                className="hero-rise mt-6 text-4xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl"
                style={{ animationDelay: "120ms" }}
              >
                <span className="block">Buy and Deliver</span>
                <span className="hero-shimmer block">digital products</span>
                <span className="block">with confidence.</span>
              </h1>

              <p
                className="hero-rise mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400"
                style={{ animationDelay: "240ms" }}
              >
                Orion Dev Store gives customers smooth checkout, secure delivery links, and a
                polished product experience from discovery to download.
              </p>

              <div
                className="hero-rise mt-9 flex flex-wrap items-center gap-3"
                style={{ animationDelay: "360ms" }}
              >
                <Link
                  href="/products"
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl border border-emerald-400/50 bg-emerald-500/15 px-5 py-2.5 text-sm font-medium text-emerald-200 shadow-[0_0_50px_-12px_rgba(16,185,129,0.7)] transition hover:border-emerald-300 hover:text-white"
                >
                  <span
                    className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-emerald-500/30 via-cyan-400/25 to-violet-500/25 opacity-0 transition duration-500 group-hover:opacity-100"
                    aria-hidden
                  />
                  Browse products
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden
                  />
                </Link>
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-zinc-300 backdrop-blur transition hover:border-emerald-500/30 hover:bg-white/[0.06] hover:text-emerald-300"
                >
                  Contact sales
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              </div>
            </div>

            <div className="mt-16 grid gap-4 sm:grid-cols-3">
              {heroFeatures.map(({ icon: Icon, title, body }, i) => (
                <div
                  key={title}
                  className="hero-rise group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur transition duration-500 hover:-translate-y-0.5 hover:border-emerald-500/30 hover:bg-white/[0.06]"
                  style={{ animationDelay: `${480 + i * 90}ms` }}
                >
                  <div
                    className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-500/10 blur-2xl transition duration-500 group-hover:bg-emerald-500/30"
                    aria-hidden
                  />
                  <div className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 transition duration-300 group-hover:scale-110 group-hover:border-emerald-400/60 group-hover:text-emerald-200">
                    <Icon className="h-4 w-4" aria-hidden />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-white">{title}</p>
                  <p className="mt-1 text-sm text-zinc-500">{body}</p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-zinc-950"
            aria-hidden
          />
        </section>

        <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-6 pb-20">
          <section className="reveal" aria-labelledby="categories-heading">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-300/80">
                  Curated verticals
                </p>
                <h2
                  id="categories-heading"
                  className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl"
                >
                  Browse by category
                </h2>
              </div>
              <Link
                href="/products"
                className="link-underline text-xs font-medium text-emerald-300 hover:text-emerald-200"
              >
                See all products
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>

            <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {categoryCards.map((card, i) => (
                <li
                  key={card.slug}
                  className="reveal reveal-tilt"
                  style={{ transitionDelay: `${i * 70}ms` }}
                >
                  <Link
                    href={`/products?category=${encodeURIComponent(card.slug)}`}
                    className="group glass-card block h-full"
                  >
                    <div className="relative overflow-hidden">
                      <div
                        className="h-44 w-full bg-cover bg-center transition duration-700 ease-out group-hover:scale-110"
                        style={{ backgroundImage: `url("${card.image}")` }}
                        aria-hidden
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/95 via-zinc-950/40 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-5">
                        <p className="text-base font-semibold text-white">
                          {card.title}
                        </p>
                        <p className="mt-1 text-xs text-zinc-300/90">
                          {card.subtitle}
                        </p>
                        <span className="mt-3 inline-flex items-center gap-1 text-xs text-emerald-300 opacity-0 transition duration-300 group-hover:opacity-100">
                          Explore
                          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {supabaseReady && featured.length > 0 ? (
            <section
              className="mt-20"
              aria-labelledby="featured-heading"
            >
              <div className="reveal flex items-end justify-between gap-3">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-300/80">
                    Hand-picked
                  </p>
                  <h2
                    id="featured-heading"
                    className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl"
                  >
                    Featured products
                  </h2>
                </div>
                <Link
                  href="/products"
                  className="link-underline text-xs font-medium text-emerald-300 hover:text-emerald-200"
                >
                  View all
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </div>
              <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featured.map((product, i) => (
                  <li key={product.id}>
                    <ProductCard product={product} delayMs={i * 90} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <CtaBanner className="mt-24" />
        </main>
      </div>
    </StoreChrome>
  );
}
