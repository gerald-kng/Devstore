import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  Clock,
  Code2,
  HandshakeIcon,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { CtaBanner } from "@/components/cta-banner";
import { HireForm } from "@/components/hire-form";
import { PageBackdrop } from "@/components/page-backdrop";
import { StoreChrome } from "@/components/store-chrome";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Hire a Developer",
  description:
    "Tell us about your project — web app, mobile app, automation, AI bot, or custom integration — and get a tailored proposal within one business day.",
  path: "/hire",
});

const PROCESS = [
  {
    title: "Tell us your idea",
    description:
      "Share goals, scope, and constraints with the form. The more detail, the faster we can scope it.",
  },
  {
    title: "Discovery call",
    description:
      "Within 24h we book a 30-minute call to align on requirements, risks, and success metrics.",
  },
  {
    title: "Fixed-scope proposal",
    description:
      "You receive a written scope, milestone plan, and a fixed price (or capped time-and-materials).",
  },
  {
    title: "Build & ship",
    description:
      "Weekly check-ins, transparent progress, and full ownership of the codebase on delivery.",
  },
];

const PERKS = [
  {
    icon: Briefcase,
    title: "Senior engineering",
    description:
      "Years of experience shipping production tools, dashboards, and automations.",
  },
  {
    icon: Code2,
    title: "Modern stack",
    description:
      "Next.js, TypeScript, Supabase, Postgres, n8n, OpenAI — pragmatic, not trendy.",
  },
  {
    icon: ShieldCheck,
    title: "You own the code",
    description:
      "Source, infra, and credentials are yours from day one. NDA on request.",
  },
  {
    icon: Clock,
    title: "Fast turnaround",
    description:
      "Most builds ship in 2–6 weeks with weekly milestone-based check-ins.",
  },
] as const;

export default function HirePage() {
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

          <div className="mt-8 max-w-3xl">
            <div
              className="hero-rise inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/[0.08] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-300 backdrop-blur"
              style={{ animationDelay: "0ms" }}
            >
              <HandshakeIcon className="h-3.5 w-3.5" aria-hidden />
              Custom builds
              <Sparkles className="h-3 w-3 text-emerald-300/80" aria-hidden />
            </div>
            <h1
              className="hero-rise mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl"
              style={{ animationDelay: "120ms" }}
            >
              Hire a <span className="hero-shimmer">developer</span>.
            </h1>
            <p
              className="hero-rise mt-4 max-w-2xl text-lg leading-relaxed text-zinc-400"
              style={{ animationDelay: "240ms" }}
            >
              Have an idea, an automation to build, or a bot/dashboard you need
              shipped? Share the details and we&apos;ll come back with a clear
              scope, timeline, and price within one business day.
            </p>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="reveal">
              <HireForm />
            </div>

            <aside className="space-y-6">
              <div
                className="reveal glass-card p-5"
                style={{ transitionDelay: "120ms" }}
              >
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-300/80">
                  How it works
                </p>
                <ol className="mt-4 space-y-4">
                  {PROCESS.map((step, i) => (
                    <li key={step.title} className="flex gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/10 text-[11px] font-semibold text-emerald-300">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {step.title}
                        </p>
                        <p className="mt-0.5 text-xs leading-relaxed text-zinc-400">
                          {step.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <ul className="space-y-3">
                {PERKS.map(({ icon: Icon, title, description }, i) => (
                  <li
                    key={title}
                    className="reveal glass-card flex gap-3 p-4"
                    style={{ transitionDelay: `${200 + i * 60}ms` }}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-white">{title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-zinc-400">
                        {description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <div
                className="reveal glass-card p-5"
                style={{ transitionDelay: "440ms" }}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" aria-hidden />
                  <p className="text-sm font-medium text-white">
                    What you&apos;ll need
                  </p>
                </div>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-zinc-400">
                  <li>A short description of the problem you&apos;re solving</li>
                  <li>Who the users are and what they should be able to do</li>
                  <li>Any must-have integrations (Stripe, Supabase, OpenAI…)</li>
                  <li>A budget range &amp; rough timeline</li>
                </ul>
              </div>
            </aside>
          </div>

          <CtaBanner
            className="mt-24"
            title={
              <>
                Prefer to <span className="hero-shimmer">browse first?</span>
              </>
            }
            description="Check out our ready-to-launch products and courses while you wait for our reply."
            actions={[
              { href: "/products", label: "Browse products", variant: "primary", icon: "right" },
              { href: "/contact", label: "General contact", variant: "secondary", icon: "upRight" },
            ]}
          />
        </main>
      </div>
    </StoreChrome>
  );
}
