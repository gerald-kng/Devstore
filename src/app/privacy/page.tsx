import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { CtaBanner } from "@/components/cta-banner";
import { PageBackdrop } from "@/components/page-backdrop";
import { StoreChrome } from "@/components/store-chrome";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "How Orion Dev Store collects, uses, and retains information about customers and visitors.",
  path: "/privacy",
});

const sections: { title: string; body: string }[] = [
  {
    title: "Information we collect",
    body: "We collect information required to process purchases and support requests, such as email address, order metadata, and messages you submit through forms.",
  },
  {
    title: "How we use information",
    body: "We use collected data to process payments, deliver purchased products, respond to support inquiries, and improve service reliability and security.",
  },
  {
    title: "Third-party services",
    body: "We rely on third-party providers (for example payment processors and hosting vendors). Their handling of data is governed by their own policies.",
  },
  {
    title: "Data retention",
    body: "We retain order and support records for operational, legal, and fraud-prevention purposes for as long as reasonably necessary.",
  },
  {
    title: "Security",
    body: "We apply reasonable technical and organizational safeguards, but no system can guarantee absolute security.",
  },
];

export default function PrivacyPage() {
  return (
    <StoreChrome>
      <div className="relative isolate flex min-h-full flex-1 flex-col overflow-hidden bg-zinc-950 text-zinc-50">
        <PageBackdrop variant="subtle" />

        <main className="relative z-10 mx-auto w-full max-w-3xl flex-1 px-6 pt-16 pb-20 sm:pt-20">
          <Link
            href="/"
            className="link-underline text-sm text-emerald-300 hover:text-emerald-200"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            Back to store
          </Link>

          <div className="mt-8">
            <div
              className="hero-rise inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/[0.08] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-300 backdrop-blur"
              style={{ animationDelay: "0ms" }}
            >
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
              Legal
            </div>
            <h1
              className="hero-rise mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl"
              style={{ animationDelay: "120ms" }}
            >
              Privacy <span className="hero-shimmer">Policy</span>
            </h1>
          </div>

          <div className="mt-10 space-y-4">
            {sections.map((s, i) => (
              <section
                key={s.title}
                className="reveal glass-card p-5"
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <h2 className="text-base font-semibold text-white">{s.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300">{s.body}</p>
              </section>
            ))}
            <section
              className="reveal glass-card p-5"
              style={{ transitionDelay: `${sections.length * 70}ms` }}
            >
              <h2 className="text-base font-semibold text-white">Contact</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                To request access, correction, or deletion of your personal data, please use our{" "}
                <Link
                  href="/contact"
                  className="link-underline text-emerald-300 hover:text-emerald-200"
                >
                  Contact page
                </Link>
                .
              </p>
            </section>
          </div>

          <CtaBanner className="mt-20" />
        </main>
      </div>
    </StoreChrome>
  );
}
