import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { CtaBanner } from "@/components/cta-banner";
import { PageBackdrop } from "@/components/page-backdrop";
import { StoreChrome } from "@/components/store-chrome";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Use",
  description: "Terms of use for purchases and downloads from Orion Dev Store.",
  path: "/terms",
});

const sections: { title: string; body: string }[] = [
  {
    title: "Acceptance of terms",
    body: "By purchasing or using products from this store, you agree to these Terms of Use. If you do not agree, do not use the services.",
  },
  {
    title: "License and usage",
    body: "Products are licensed, not sold. Unless otherwise stated, your purchase grants a non-transferable license for personal or internal business use.",
  },
  {
    title: "Payments and delivery",
    body: "Payments are processed through supported providers. Download and installation access is provided after successful payment verification.",
  },
  {
    title: "Refund policy",
    body: "Due to the digital nature of products, refunds may be limited or unavailable after access is granted, except where required by law.",
  },
  {
    title: "Liability disclaimer",
    body: "Products are provided “as is” without warranties of any kind. To the maximum extent allowed by law, the store is not liable for indirect or consequential damages.",
  },
];

export default function TermsPage() {
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
              <FileText className="h-3.5 w-3.5" aria-hidden />
              Legal
            </div>
            <h1
              className="hero-rise mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl"
              style={{ animationDelay: "120ms" }}
            >
              Terms of <span className="hero-shimmer">Use</span>
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
                For questions about these terms, please use the{" "}
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
