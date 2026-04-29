import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Download,
  Film,
  KeyRound,
  Sparkles,
} from "lucide-react";
import { getPaidOrderByAccessToken } from "@/lib/access";
import { AccessLinkRequestForm } from "@/components/access-link-request-form";
import { PageBackdrop } from "@/components/page-backdrop";
import { resolveProductDeliveryPaths } from "@/lib/delivery";
import { getProductById } from "@/lib/products";
import { createDeliverySignedUrls } from "@/lib/storage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Access portal",
  robots: { index: false, follow: false },
};

type PageProps = {
  params: Promise<{ token: string }>;
};

function StateShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate flex min-h-full flex-1 flex-col overflow-hidden bg-zinc-950 px-6 py-20 text-zinc-100">
      <PageBackdrop variant="default" />
      <div className="relative z-10 mx-auto w-full max-w-xl">{children}</div>
    </div>
  );
}

export default async function AccessPortalPage({ params }: PageProps) {
  const { token } = await params;
  if (!token || token.length < 32) {
    notFound();
  }

  const access = await getPaidOrderByAccessToken(token);
  if (!access) {
    return (
      <StateShell>
        <div className="reveal glass-card flex flex-col items-center p-8 text-center">
          <KeyRound className="mb-5 h-10 w-10 text-amber-400" />
          <h1 className="text-2xl font-semibold text-white">
            Access link invalid
          </h1>
          <p className="mt-3 max-w-md text-sm text-zinc-400">
            This access link is invalid, expired, or revoked. Contact support if
            payment was successful.
          </p>
        </div>
        <div className="reveal mt-6">
          <AccessLinkRequestForm />
        </div>
      </StateShell>
    );
  }

  const product = await getProductById(access.productId);
  if (!product) {
    notFound();
  }

  const paths = await resolveProductDeliveryPaths(product);
  const urls = await createDeliverySignedUrls(paths);
  const minutes = Math.round(urls.expiresInSeconds / 60);

  return (
    <StateShell>
      <div
        className="hero-rise inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/[0.08] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-300 backdrop-blur"
        style={{ animationDelay: "0ms" }}
      >
        <KeyRound className="h-3.5 w-3.5" aria-hidden />
        Access portal
        <Sparkles className="h-3 w-3 text-emerald-300/80" aria-hidden />
      </div>

      <h1
        className="hero-rise mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl"
        style={{ animationDelay: "120ms" }}
      >
        {product.name}
      </h1>
      <p
        className="hero-rise mt-3 text-sm text-zinc-400"
        style={{ animationDelay: "240ms" }}
      >
        Download portal unlocked. Links are refreshed server-side and expire in
        about {minutes} minutes. Reopen your access link anytime before it
        expires.
      </p>

      <div className="reveal mt-8 glass-card card-glow space-y-3 p-6">
        <a
          href={urls.appDownloadUrl}
          className="group flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-3 text-sm font-medium text-white transition hover:border-emerald-400/50"
        >
          <span className="inline-flex items-center gap-2">
            <Download className="h-4 w-4 text-emerald-300" aria-hidden />
            Application file
          </span>
          <span className="text-xs text-zinc-500 transition group-hover:text-emerald-200">
            Signed URL
          </span>
        </a>
        <a
          href={urls.videoDownloadUrl}
          className="group flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-3 text-sm font-medium text-white transition hover:border-emerald-400/50"
        >
          <span className="inline-flex items-center gap-2">
            <Film className="h-4 w-4 text-emerald-300" aria-hidden />
            Installation video
          </span>
          <span className="text-xs text-zinc-500 transition group-hover:text-emerald-200">
            Signed URL
          </span>
        </a>
      </div>

      <p className="reveal mt-6 text-xs text-zinc-500">
        Receipt email:{" "}
        <span className="text-zinc-300">{access.customerEmail}</span>
      </p>

      <Link
        href={`/products/${product.slug}`}
        className="link-underline mt-8 inline-flex text-sm text-emerald-300 hover:text-emerald-200"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
        Back to product
      </Link>
    </StateShell>
  );
}
