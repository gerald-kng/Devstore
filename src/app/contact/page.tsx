import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clock, Mail, MessageSquare, Sparkles } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { CtaBanner } from "@/components/cta-banner";
import { PageBackdrop } from "@/components/page-backdrop";
import { StoreChrome } from "@/components/store-chrome";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "Reach out for help with a purchase, download access, or product questions.",
  path: "/contact",
});

function getSupportEmail(): string {
  const fromAdmin = process.env.ADMIN_EMAILS?.split(",")
    .map((s) => s.trim())
    .find((s) => s.length > 0);
  return fromAdmin ?? "support@example.com";
}

export default function ContactPage() {
  const supportEmail = getSupportEmail();

  return (
    <StoreChrome>
      <div className="relative isolate flex min-h-full flex-1 flex-col overflow-hidden bg-zinc-950 text-zinc-50">
        <PageBackdrop variant="default" />

        <main className="relative z-10 mx-auto w-full max-w-4xl flex-1 px-6 pt-16 pb-20 sm:pt-20">
          <Link
            href="/"
            className="link-underline text-sm text-emerald-300 hover:text-emerald-200"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            Back to store
          </Link>

          <div className="mt-8 max-w-2xl">
            <div
              className="hero-rise inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/[0.08] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-300 backdrop-blur"
              style={{ animationDelay: "0ms" }}
            >
              <MessageSquare className="h-3.5 w-3.5" aria-hidden />
              Get in touch
              <Sparkles className="h-3 w-3 text-emerald-300/80" aria-hidden />
            </div>
            <h1
              className="hero-rise mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl"
              style={{ animationDelay: "120ms" }}
            >
              We&apos;re <span className="hero-shimmer">listening</span>.
            </h1>
            <p
              className="hero-rise mt-4 text-lg leading-relaxed text-zinc-400"
              style={{ animationDelay: "240ms" }}
            >
              Need help with a purchase, download access, or product question?
              Send us a note and we&apos;ll reply as soon as possible.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <div className="reveal sm:col-span-2 lg:col-span-1">
              <ContactForm />
            </div>

            <div className="space-y-4 sm:col-span-2 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0 lg:col-span-1 lg:grid-cols-1">
              <a
                href={`mailto:${supportEmail}`}
                className="reveal glass-card card-glow group block p-5"
                style={{ transitionDelay: "100ms" }}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 transition group-hover:scale-110">
                    <Mail className="h-4 w-4" aria-hidden />
                  </span>
                  <p className="text-sm font-medium text-white">Email support</p>
                </div>
                <p className="mt-3 break-all text-sm text-zinc-400">
                  {supportEmail}
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  We reply within one business day.
                </p>
              </a>

              <div
                className="reveal glass-card p-5"
                style={{ transitionDelay: "200ms" }}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
                    <MessageSquare className="h-4 w-4" aria-hidden />
                  </span>
                  <p className="text-sm font-medium text-white">
                    What to include
                  </p>
                </div>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-400">
                  <li>Your order ID</li>
                  <li>The product name or slug</li>
                  <li>A short description of the issue</li>
                </ul>
              </div>

              <div
                className="reveal glass-card p-5 sm:col-span-2 lg:col-span-1"
                style={{ transitionDelay: "300ms" }}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 ambient-float">
                    <Clock className="h-4 w-4" aria-hidden />
                  </span>
                  <p className="text-sm font-medium text-white">Office hours</p>
                </div>
                <p className="mt-3 text-sm text-zinc-400">
                  Mon&ndash;Fri, 9am&ndash;6pm UTC. Out-of-hours messages are
                  queued for the next morning.
                </p>
              </div>
            </div>
          </div>

          <CtaBanner
            className="mt-24"
            title={
              <>
                While you wait,{" "}
                <span className="hero-shimmer">explore the catalog.</span>
              </>
            }
            description="Tools, bots, dashboards, and courses — pick the one that fits your stack and ship today."
            actions={[
              { href: "/products", label: "Browse products", variant: "primary", icon: "right" },
              { href: "/courses", label: "View courses", variant: "secondary", icon: "upRight" },
            ]}
          />
        </main>
      </div>
    </StoreChrome>
  );
}
