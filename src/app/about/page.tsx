import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Boxes,
  Compass,
  Cpu,
  Gauge,
  Globe2,
  Hammer,
  HeartHandshake,
  Layers,
  PackageCheck,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
  Zap,
} from "lucide-react";
import { CtaBanner } from "@/components/cta-banner";
import { PageBackdrop } from "@/components/page-backdrop";
import { StoreChrome } from "@/components/store-chrome";
import { isSupabaseConfigured } from "@/lib/env";
import { buildMetadata } from "@/lib/seo";
import { getCmsPageBySlug } from "@/lib/site";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "Orion Dev Store ships pragmatic digital products — apps, automations, AI agents, and courses — built for builders.",
  path: "/about",
});

const VALUES = [
  {
    icon: Zap,
    title: "Ship fast",
    description:
      "Every product is built to be installed and useful within minutes, not weekends. No setup essays.",
  },
  {
    icon: Hammer,
    title: "Practical over trendy",
    description:
      "We choose tools that survive a Tuesday in production. Boring tech, sharp UX.",
  },
  {
    icon: ShieldCheck,
    title: "You own it",
    description:
      "Pay once, get the source. No SaaS lock-in, no monthly bill creeping up on you.",
  },
  {
    icon: HeartHandshake,
    title: "Real support",
    description:
      "Replies from the people who actually shipped the thing. Same business day, every weekday.",
  },
] as const;

const PROCESS = [
  {
    icon: Compass,
    title: "Design from the outcome",
    description:
      "Start with the result the buyer needs in 15 minutes — the rest is detail.",
  },
  {
    icon: Layers,
    title: "Build the small thing well",
    description:
      "Tight scope, modern stack (Next.js, Supabase, n8n, OpenAI), and a clean install path.",
  },
  {
    icon: PackageCheck,
    title: "Package for instant access",
    description:
      "App + install walkthrough video, signed download links, and clean docs. Day-one usable.",
  },
  {
    icon: Globe2,
    title: "Ship & support",
    description:
      "Buyers get email-gated access tokens. Updates and fixes go out for free.",
  },
] as const;

const SHIP_TYPES = [
  { icon: Cpu, label: "Web apps & dashboards" },
  { icon: Bot, label: "AI agents & bots" },
  { icon: Workflow, label: "Automations & integrations" },
  { icon: Boxes, label: "Internal tools & micro-SaaS" },
  { icon: Rocket, label: "Landing pages & launch kits" },
  { icon: Gauge, label: "Analytics & reporting tools" },
] as const;

async function getAboutBody(): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;
  const page = await getCmsPageBySlug("about");
  return page?.body?.trim() ? page.body : null;
}

async function getStats(): Promise<{
  products: number;
  paidOrders: number;
  categories: number;
  pages: number;
}> {
  if (!isSupabaseConfigured()) {
    return { products: 0, paidOrders: 0, categories: 0, pages: 0 };
  }
  const db = createAdminClient();
  const [p, o, c, s] = await Promise.all([
    db
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
    db
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "paid"),
    db
      .from("product_categories")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
    db
      .from("static_pages")
      .select("id", { count: "exact", head: true })
      .eq("is_published", true),
  ]);
  return {
    products: p.count ?? 0,
    paidOrders: o.count ?? 0,
    categories: c.count ?? 0,
    pages: s.count ?? 0,
  };
}

const FALLBACK_STORY = `Orion Dev Store started as a workbench — a place to ship the small,
useful tools we kept building for our own projects: dashboards that actually
opened, automations that didn't break overnight, AI helpers tuned to one job.

We opened it up because every team we worked with kept asking the same thing:
"Do you have a quick version we can buy?" Now we do. Each product is something
we'd happily run ourselves — short install, clean source, and email-gated access
the moment payment clears.

If you're a builder, an indie founder, or a team that just wants to ship — this
store is for you.`;

export default async function AboutPage() {
  const [body, stats] = await Promise.all([getAboutBody(), getStats()]);
  const story = body ?? FALLBACK_STORY;

  const statCards: { label: string; value: string; sub?: string }[] = [
    {
      label: "Active products",
      value: stats.products > 0 ? `${stats.products}+` : "Curated",
      sub: "Built and maintained in-house",
    },
    {
      label: "Paid orders shipped",
      value: stats.paidOrders > 0 ? `${stats.paidOrders}+` : "Day 1",
      sub: "Instant delivery via signed links",
    },
    {
      label: "Categories",
      value: stats.categories > 0 ? `${stats.categories}` : "Growing",
      sub: "Apps, bots, automations, courses",
    },
    {
      label: "Reply window",
      value: "< 1 day",
      sub: "Mon–Fri, by the people who built it",
    },
  ];

  return (
    <StoreChrome>
      <div className="relative isolate flex min-h-full flex-1 flex-col overflow-hidden bg-zinc-950 text-zinc-50">
        <PageBackdrop variant="default" />

        <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-6 pt-16 pb-20 sm:pt-20">
          <Link
            href="/"
            className="link-underline text-sm text-emerald-300 hover:text-emerald-200"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            Back to store
          </Link>

          {/* HERO */}
          <section className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end">
            <div>
              <div
                className="hero-rise inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/[0.08] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-300 backdrop-blur"
                style={{ animationDelay: "0ms" }}
              >
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                About Orion Dev
              </div>
              <h1
                className="hero-rise mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl"
                style={{ animationDelay: "120ms" }}
              >
                A small studio for{" "}
                <span className="hero-shimmer">builders</span>.
              </h1>
              <p
                className="hero-rise mt-5 max-w-2xl text-lg leading-relaxed text-zinc-400"
                style={{ animationDelay: "240ms" }}
              >
                We design, ship, and sell digital products you can install in
                minutes — apps, automations, AI agents, and courses for the
                people doing the actual work.
              </p>
              <div
                className="hero-rise mt-7 flex flex-wrap gap-3"
                style={{ animationDelay: "360ms" }}
              >
                <Link
                  href="/products"
                  className="group inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-200 transition hover:border-emerald-400 hover:bg-emerald-500/20"
                >
                  Browse the catalog
                  <ArrowRight
                    className="h-3.5 w-3.5 transition group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
                <Link
                  href="/hire"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-emerald-500/40 hover:text-emerald-200"
                >
                  Hire us for a custom build
                </Link>
              </div>
            </div>

            {/* Decorative orb panel */}
            <div
              className="reveal relative hidden h-56 w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 lg:block"
              style={{ transitionDelay: "300ms" }}
              aria-hidden
            >
              <div className="hero-orb hero-orb-a absolute -left-10 top-4 h-40 w-40 rounded-full bg-emerald-500/30 blur-3xl" />
              <div className="hero-orb hero-orb-b absolute -right-10 bottom-2 h-44 w-44 rounded-full bg-cyan-500/25 blur-3xl" />
              <div className="hero-conic absolute inset-0 opacity-40" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-400/40 bg-emerald-500/10 text-emerald-200 ambient-float">
                  <Boxes className="h-5 w-5" aria-hidden />
                </span>
                <span className="text-sm font-semibold tracking-tight text-white">
                  Orion <span className="text-emerald-300">Dev</span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.28em] text-zinc-500">
                  Built for builders
                </span>
              </div>
            </div>
          </section>

          {/* STATS */}
          <section className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((s, i) => (
              <div
                key={s.label}
                className="reveal glass-card p-5"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-emerald-300/80">
                  {s.label}
                </p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-white">
                  {s.value}
                </p>
                {s.sub ? (
                  <p className="mt-1 text-xs text-zinc-500">{s.sub}</p>
                ) : null}
              </div>
            ))}
          </section>

          {/* OUR STORY */}
          <section className="mt-20 grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)]">
            <div className="reveal">
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-300/80">
                Our story
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                Built from a workbench.
              </h2>
              <p className="mt-3 text-sm text-zinc-500">
                Edit this from{" "}
                <span className="text-zinc-400">Admin → Site pages</span>{" "}
                (slug:{" "}
                <code className="rounded bg-zinc-900 px-1 py-0.5 text-[11px]">
                  about
                </code>
                ).
              </p>
            </div>
            <article
              className="reveal glass-card p-6 sm:p-8"
              style={{ transitionDelay: "120ms" }}
            >
              <div className="prose prose-invert max-w-none whitespace-pre-wrap text-zinc-300">
                {story}
              </div>
            </article>
          </section>

          {/* VALUES */}
          <section className="mt-20">
            <div className="reveal max-w-2xl">
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-300/80">
                What we believe
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Four principles, every product.
              </h2>
              <p className="mt-3 text-zinc-400">
                These aren&apos;t marketing lines — every page, install flow,
                and refund decision is run through them.
              </p>
            </div>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {VALUES.map(({ icon: Icon, title, description }, i) => (
                <li
                  key={title}
                  className="reveal glass-card group relative overflow-hidden p-5"
                  style={{ transitionDelay: `${i * 90}ms` }}
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/15 blur-3xl opacity-0 transition duration-500 group-hover:opacity-100"
                  />
                  <span className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <h3 className="mt-4 text-sm font-semibold text-white">
                    {title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                    {description}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* PROCESS */}
          <section className="mt-20">
            <div className="reveal max-w-2xl">
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-300/80">
                How we build
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Outcome → install → support, in that order.
              </h2>
            </div>
            <ol className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {PROCESS.map(({ icon: Icon, title, description }, i) => (
                <li
                  key={title}
                  className="reveal glass-card relative p-5"
                  style={{ transitionDelay: `${i * 90}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-white">
                    {title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                    {description}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          {/* WHAT WE SHIP */}
          <section className="mt-20">
            <div className="reveal flex flex-wrap items-end justify-between gap-3">
              <div className="max-w-2xl">
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-300/80">
                  What we ship
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  Tools across the stack.
                </h2>
                <p className="mt-3 text-zinc-400">
                  Not a niche store — but everything is opinionated, and
                  everything is something we&apos;d run ourselves.
                </p>
              </div>
              <Link
                href="/products"
                className="link-underline text-sm font-medium text-emerald-300 hover:text-emerald-200"
              >
                See all products
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {SHIP_TYPES.map(({ icon: Icon, label }, i) => (
                <li
                  key={label}
                  className="reveal glass-card flex items-center gap-3 p-4"
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="text-sm font-medium text-zinc-200">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* WHO IT'S FOR */}
          <section className="mt-20">
            <div
              className="reveal glass-card relative overflow-hidden p-6 sm:p-8"
              aria-label="Who it's for"
            >
              <div
                aria-hidden
                className="hero-orb hero-orb-a pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl"
              />
              <div
                aria-hidden
                className="hero-orb hero-orb-b pointer-events-none absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl"
              />
              <div className="relative grid gap-6 sm:grid-cols-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
                    <Users className="h-4 w-4" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Indie founders
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                      Skip the boilerplate. Buy the building block, ship the
                      app this week.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
                    <Hammer className="h-4 w-4" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Operators &amp; agencies
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                      Drop in tools that automate the boring parts of your
                      ops stack.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
                    <Rocket className="h-4 w-4" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Devs who want to learn
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                      Source you can read, install videos you can rewind,
                      patterns you can reuse.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <CtaBanner
            className="mt-24"
            title={
              <>
                Need something{" "}
                <span className="hero-shimmer">made just for you?</span>
              </>
            }
            description="Tell us what you want built and we'll come back with a fixed-scope proposal within one business day."
            actions={[
              { href: "/hire", label: "Hire a developer", variant: "primary", icon: "right" },
              { href: "/products", label: "Browse products", variant: "secondary", icon: "upRight" },
            ]}
          />
        </main>
      </div>
    </StoreChrome>
  );
}
