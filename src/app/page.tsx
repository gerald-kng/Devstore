import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { StoreChrome } from "@/components/store-chrome";
import { isSupabaseConfigured } from "@/lib/env";
import { listActiveProducts } from "@/lib/products";
import { getProductMainImageUrl } from "@/lib/public-assets";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabaseReady = isSupabaseConfigured();
  const products = supabaseReady ? await listActiveProducts() : [];
  const featured = products.slice(0, 3);
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

  return (
    <StoreChrome>
      <div className="relative flex min-h-full flex-1 flex-col overflow-hidden bg-zinc-950 text-zinc-50">
        <div className="pointer-events-none absolute inset-0 opacity-80" aria-hidden>
          <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl" />
        </div>

        <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-6 py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-400/80">
              Digital Product Marketplace
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              Sell and deliver digital products with confidence.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-zinc-400">
              Orion Dev Store gives customers smooth checkout, secure delivery links, and a
              polished product experience from discovery to download.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300 transition hover:border-emerald-400 hover:bg-emerald-500/20"
              >
                Browse products
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/contact"
                className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-emerald-500/30 hover:text-emerald-300"
              >
                Contact sales
              </Link>
            </div>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-3">
            {[
              { icon: ShieldCheck, title: "Secure checkout", body: "Payments are verified before access is granted." },
              { icon: Zap, title: "Instant delivery", body: "Customers get access links immediately after successful payment." },
              { icon: CheckCircle2, title: "Admin control", body: "Manage products, categories, and content from one dashboard." },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <Icon className="h-5 w-5 text-emerald-400" aria-hidden />
                <p className="mt-3 text-sm font-semibold text-white">{title}</p>
                <p className="mt-1 text-sm text-zinc-500">{body}</p>
              </div>
            ))}
          </div>

          <div className="mt-14">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-white">Browse by category</p>
              <Link href="/products" className="text-xs text-emerald-400 hover:text-emerald-300">
                See all products
              </Link>
            </div>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categoryCards.map((card) => (
                <li key={card.slug}>
                  <Link
                    href={`/products?category=${encodeURIComponent(card.slug)}`}
                    className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40"
                  >
                    <div
                      className="h-44 w-full bg-cover bg-center transition duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url("${card.image}")` }}
                      aria-hidden
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <p className="text-sm font-semibold text-white">{card.title}</p>
                      <p className="mt-1 text-xs text-zinc-300">{card.subtitle}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {supabaseReady && featured.length > 0 ? (
            <div className="mt-14 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-white">Featured products</p>
                <Link href="/products" className="text-xs text-emerald-400 hover:text-emerald-300">
                  View all
                </Link>
              </div>
              <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                {featured.map((product) => (
                  <li key={product.id} className="overflow-hidden rounded-xl border border-white/10 bg-zinc-900/50">
                    {getProductMainImageUrl(product.main_image_path) ? (
                      <div className="relative h-28 w-full bg-zinc-800">
                        <Image
                          src={getProductMainImageUrl(product.main_image_path)!}
                          alt=""
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : null}
                    <div className="p-3">
                    <p className="text-sm font-medium text-white">{product.name}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-zinc-500">{product.summary}</p>
                    <Link
                      href={`/products/${product.slug}`}
                      className="mt-3 inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300"
                    >
                      Open
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                    </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

        </main>
      </div>
    </StoreChrome>
  );
}
