import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Boxes, Download, ShieldCheck, Video } from "lucide-react";
import { CheckoutForm } from "@/components/checkout-form";
import { ProductImageGallery } from "@/components/product-image-gallery";
import { ProductCommentForm } from "@/components/product-comment-form";
import { ProductReviewForm } from "@/components/product-review-form";
import { ProductDemo } from "@/components/product-demo";
import { StoreChrome } from "@/components/store-chrome";
import { getCategoryById } from "@/lib/categories";
import { listProductComments, listProductReviews } from "@/lib/engagement";
import { isSupabaseConfigured } from "@/lib/env";
import {
  getProductDemoDisplay,
  getProductImageGallery,
} from "@/lib/product-media";
import {
  formatProductPrice,
  getProductBySlug,
  isValidProductSlug,
} from "@/lib/products";
import { getProductMainImageUrl } from "@/lib/public-assets";
import { parseProductFeatures } from "@/types/product";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isValidProductSlug(slug)) {
    return { title: "Product" };
  }
  const product = await getProductBySlug(slug);
  if (!product) {
    return { title: "Product not found" };
  }
  return {
    title: `${product.name} — Orion Dev Store`,
    description: product.summary,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  if (!isValidProductSlug(slug)) {
    notFound();
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-zinc-950 px-6 py-24 text-center text-amber-200">
        <p className="max-w-md text-sm">
          Supabase is not configured. Set{" "}
          <code className="text-amber-100/90">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="text-amber-100/90">SUPABASE_SERVICE_ROLE_KEY</code> in{" "}
          <code className="text-amber-100/90">.env.local</code>.
        </p>
        <Link
          href="/"
          className="mt-8 text-sm font-medium text-emerald-400 hover:text-emerald-300"
        >
          Back to home
        </Link>
      </div>
    );
  }

  const product = await getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  const [demo, gallery, category, comments, reviews] = await Promise.all([
    getProductDemoDisplay(product),
    getProductImageGallery(product.id),
    product.category_id
      ? getCategoryById(product.category_id)
      : Promise.resolve(null),
    listProductComments(product.id),
    listProductReviews(product.id),
  ]);
  const mainImage = getProductMainImageUrl(product.main_image_path);
  const gallerySlides: { id: string; url: string; alt: string }[] = [];
  if (mainImage && product.main_image_path) {
    gallerySlides.push({
      id: `main:${product.main_image_path}`,
      url: mainImage,
      alt: product.name,
    });
  }
  for (const img of gallery) {
    const u = getProductMainImageUrl(img.storage_path);
    if (!u) {
      continue;
    }
    if (product.main_image_path && img.storage_path === product.main_image_path) {
      continue;
    }
    gallerySlides.push({
      id: img.id,
      url: u,
      alt: img.alt_text.trim() ? img.alt_text : product.name,
    });
  }
  const features = parseProductFeatures(product.features);
  const priceLabel = formatProductPrice(product);

  const defaultBullets = [
    {
      icon: Download,
      title: "Application package",
      body: "Delivered via signed Supabase Storage URLs after payment.",
    },
    {
      icon: Video,
      title: "Installation video",
      body: "Product-specific walkthrough for this SKU.",
    },
    {
      icon: ShieldCheck,
      title: "Verified checkout",
      body: "NOWPayments webhook marks your order paid before links are minted.",
    },
  ];

  const bulletItems =
    features.length > 0
      ? features.map((f, i) => ({
          icon: [Download, Video, ShieldCheck][i % 3]!,
          title: f.title,
          body: f.body,
        }))
      : defaultBullets;

  return (
    <StoreChrome>
    <div className="relative flex flex-1 flex-col overflow-hidden bg-zinc-950 text-zinc-50">
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        aria-hidden
      >
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-white/5 bg-zinc-950/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/products"
            className="flex items-center gap-2 text-zinc-300 transition hover:text-white"
          >
            <Boxes className="h-8 w-8 text-emerald-400" aria-hidden />
            <span className="text-lg font-semibold tracking-tight">
              Orion Dev Store
            </span>
          </Link>
          <Link
            href="/products"
            className="text-sm font-medium text-zinc-400 hover:text-emerald-300"
          >
            All products
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col gap-16 px-6 py-14 lg:flex-row lg:items-start lg:justify-between">
        <section className="flex-1 space-y-8">
          <Link href="/products" className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-emerald-300">
            <span aria-hidden>←</span>
            Back
          </Link>
          <p className="text-sm font-medium text-emerald-400/90">
            {category ? (
              <span>
                {category.name} · {product.slug}
              </span>
            ) : (
              <>SKU · {product.slug}</>
            )}
          </p>
          {gallerySlides.length > 0 ? (
            <ProductImageGallery key={product.slug} slides={gallerySlides} />
          ) : null}
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {product.name}
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-zinc-400">
            {product.summary}
          </p>
          {product.description ? (
            <div className="prose prose-invert max-w-xl text-sm text-zinc-500 whitespace-pre-wrap">
              {product.description}
            </div>
          ) : null}
          <ul className="grid gap-4 sm:grid-cols-2">
            {bulletItems.map(({ icon: Icon, title, body }, index) => (
              <li
                key={`${title}-${index}`}
                className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                <div>
                  <p className="font-medium text-white">{title}</p>
                  <p className="mt-1 text-sm text-zinc-500">{body}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="space-y-4">
            <ProductReviewForm productSlug={product.slug} />
            <div className="space-y-3">
              <p className="text-sm font-semibold text-white">Recent ratings</p>
              {reviews.length < 1 ? (
                <p className="text-sm text-zinc-500">No ratings yet.</p>
              ) : (
                reviews.map((r) => (
                  <div key={r.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    <p className="text-xs text-zinc-500">{r.email}</p>
                    <p className="mt-1 text-sm text-amber-300">
                      {"★".repeat(r.rating)}
                      {"☆".repeat(5 - r.rating)}
                    </p>
                    <p className="mt-1 text-sm text-zinc-300">{r.message}</p>
                    {r.admin_reply ? (
                      <div className="mt-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2 text-xs text-emerald-200">
                        <span className="font-semibold">Admin reply:</span> {r.admin_reply}
                      </div>
                    ) : null}
                  </div>
                ))
              )}
            </div>
            <ProductCommentForm productSlug={product.slug} />
            <div className="space-y-3">
              <p className="text-sm font-semibold text-white">Recent comments</p>
              {comments.length < 1 ? (
                <p className="text-sm text-zinc-500">No comments yet.</p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    <p className="text-xs text-zinc-500">{c.email}</p>
                    <p className="mt-1 text-sm text-zinc-300">{c.message}</p>
                    {c.admin_reply ? (
                      <div className="mt-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2 text-xs text-emerald-200">
                        <span className="font-semibold">Admin reply:</span> {c.admin_reply}
                      </div>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="w-full max-w-xl flex-1 space-y-6 lg:sticky lg:top-24">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/60 shadow-2xl shadow-black/40 backdrop-blur-md">
            <div className="aspect-video bg-gradient-to-br from-zinc-800 to-zinc-950">
              <ProductDemo demo={demo} productName={product.name} />
            </div>
            <div className="space-y-1 border-t border-white/10 px-6 py-5">
              <p className="text-sm font-medium text-white">Product demo</p>
              <p className="text-sm text-zinc-500">
                Demo and install video paths are managed in the admin.
              </p>
            </div>
          </div>

          <CheckoutForm
            productSlug={product.slug}
            productName={product.name}
            priceLabel={priceLabel}
          />
        </section>
      </main>
    </div>
    </StoreChrome>
  );
}
