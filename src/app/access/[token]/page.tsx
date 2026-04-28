import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, Film, KeyRound } from "lucide-react";
import { getPaidOrderByAccessToken } from "@/lib/access";
import { AccessLinkRequestForm } from "@/components/access-link-request-form";
import { resolveProductDeliveryPaths } from "@/lib/delivery";
import { getProductById } from "@/lib/products";
import { createDeliverySignedUrls } from "@/lib/storage";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ token: string }>;
};

export default async function AccessPortalPage({ params }: PageProps) {
  const { token } = await params;
  if (!token || token.length < 32) {
    notFound();
  }

  const access = await getPaidOrderByAccessToken(token);
  if (!access) {
    return (
      <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-zinc-950 px-6 py-24 text-center text-zinc-100">
        <KeyRound className="mb-5 h-10 w-10 text-amber-400" />
        <h1 className="text-2xl font-semibold text-white">Access link invalid</h1>
        <p className="mt-3 max-w-md text-sm text-zinc-400">
          This access link is invalid, expired, or revoked. Contact support if
          payment was successful.
        </p>
        <div className="w-full max-w-md">
          <AccessLinkRequestForm />
        </div>
      </div>
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
    <div className="flex min-h-full flex-1 flex-col bg-zinc-950 px-6 py-16 text-zinc-100">
      <div className="mx-auto w-full max-w-xl">
        <h1 className="text-2xl font-semibold text-white">{product.name}</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Download portal unlocked. Links are refreshed server-side and expire in
          about {minutes} minutes. Reopen your access link anytime before it
          expires.
        </p>

        <div className="mt-8 space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <a
            href={urls.appDownloadUrl}
            className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm font-medium text-white hover:border-emerald-500/40"
          >
            <span className="inline-flex items-center gap-2">
              <Download className="h-4 w-4 text-emerald-400" />
              Application file
            </span>
            <span className="text-xs text-zinc-500">Signed URL</span>
          </a>
          <a
            href={urls.videoDownloadUrl}
            className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm font-medium text-white hover:border-emerald-500/40"
          >
            <span className="inline-flex items-center gap-2">
              <Film className="h-4 w-4 text-emerald-400" />
              Installation video
            </span>
            <span className="text-xs text-zinc-500">Signed URL</span>
          </a>
        </div>

        <p className="mt-6 text-xs text-zinc-500">
          Receipt email: <span className="text-zinc-400">{access.customerEmail}</span>
        </p>

        <Link
          href={`/products/${product.slug}`}
          className="mt-8 inline-block text-sm text-emerald-400 hover:text-emerald-300"
        >
          Back to product
        </Link>
      </div>
    </div>
  );
}
