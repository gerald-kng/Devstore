import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Download,
  MessageSquare,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  Video,
} from "lucide-react";
import { CheckoutForm } from "@/components/checkout-form";
import { CtaBanner } from "@/components/cta-banner";
import { JsonLd } from "@/components/json-ld";
import { PageBackdrop } from "@/components/page-backdrop";
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
import {
  absoluteImageUrl,
  breadcrumbLd,
  buildMetadata,
  productLd,
} from "@/lib/seo";
import { parseProductFeatures } from "@/types/product";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isValidProductSlug(slug)) {
    return buildMetadata({
      title: "Product",
      path: "/products",
      noindex: true,
    });
  }
  const product = await getProductBySlug(slug);
  if (!product) {
    return buildMetadata({
      title: "Product not found",
      path: `/products/${slug}`,
      noindex: true,
    });
  }
  const image = absoluteImageUrl(getProductMainImageUrl(product.main_image_path));
  return buildMetadata({
    title: product.name,
    description: product.summary,
    path: `/products/${product.slug}`,
    image,
    imageAlt: product.name,
  });
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  if (!isValidProductSlug(slug)) {
    notFound();
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="relative isolate flex min-h-full flex-1 flex-col items-center justify-center overflow-hidden bg-zinc-950 px-6 py-24 text-center text-amber-200">
        <PageBackdrop variant="subtle" />
        <p className="max-w-md text-sm">
          Supabase is not configured. Set{" "}
          <code className="text-amber-100/90">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="text-amber-100/90">SUPABASE_SERVICE_ROLE_KEY</code> in{" "}
          <code className="text-amber-100/90">.env.local</code>.
        </p>
        <Link
          href="/"
          className="link-underline mt-8 text-sm font-medium text-emerald-400 hover:text-emerald-300"
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

  const productStructuredData = productLd({
    name: product.name,
    slug: product.slug,
    summary: product.summary,
    description: product.description,
    priceAmount: Number(product.price_amount),
    priceCurrency: product.price_currency,
    image: absoluteImageUrl(mainImage),
    categoryName: category?.name ?? null,
  });
  const breadcrumbStructuredData = breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: product.name, path: `/products/${product.slug}` },
  ]);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : null;

  return (
    <StoreChrome>
      <JsonLd id={`ld-product-${product.slug}`} data={productStructuredData} />
      <JsonLd id={`ld-breadcrumb-${product.slug}`} data={breadcrumbStructuredData} />
      <div className="relative isolate flex flex-1 flex-col overflow-hidden bg-zinc-950 text-zinc-50">
        <PageBackdrop variant="default" />

        <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col gap-16 px-6 pt-16 pb-20 sm:pt-20">
          <div className="flex flex-1 flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">
          <section className="flex-1 space-y-10">
            <Link
              href="/products"
              className="link-underline inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-emerald-300"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
              All products
            </Link>

            <div className="space-y-5">
              <div
                className="hero-rise inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/[0.08] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-300 backdrop-blur"
                style={{ animationDelay: "0ms" }}
              >
                {category ? (
                  <>
                    <span>{category.name}</span>
                    <span className="text-emerald-400/40">•</span>
                  </>
                ) : (
                  <>
                    <span>SKU</span>
                    <span className="text-emerald-400/40">•</span>
                  </>
                )}
                <span className="font-mono normal-case tracking-normal text-emerald-200/90">
                  {product.slug}
                </span>
                <Sparkles className="h-3 w-3 text-emerald-300/80" aria-hidden />
              </div>

              <h1
                className="hero-rise text-4xl font-semibold tracking-tight text-white sm:text-5xl"
                style={{ animationDelay: "120ms" }}
              >
                {product.name}
              </h1>
              <p
                className="hero-rise max-w-xl text-lg leading-relaxed text-zinc-400"
                style={{ animationDelay: "220ms" }}
              >
                {product.summary}
              </p>
              {averageRating != null ? (
                <div
                  className="hero-rise flex items-center gap-2 text-sm text-amber-300"
                  style={{ animationDelay: "300ms" }}
                >
                  <Star className="h-4 w-4 fill-current" aria-hidden />
                  <span className="font-semibold">
                    {averageRating.toFixed(1)}
                  </span>
                  <span className="text-zinc-500">
                    ({reviews.length} {reviews.length === 1 ? "rating" : "ratings"})
                  </span>
                </div>
              ) : null}
            </div>

            {gallerySlides.length > 0 ? (
              <div className="reveal">
                <ProductImageGallery key={product.slug} slides={gallerySlides} />
              </div>
            ) : null}

            {product.description ? (
              <div className="reveal glass-card p-6">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-300/80">
                  Overview
                </p>
                <div className="prose prose-invert mt-3 max-w-none whitespace-pre-wrap text-sm text-zinc-300">
                  {product.description}
                </div>
              </div>
            ) : null}

            <div className="reveal">
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-300/80">
                What you get
              </p>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                {bulletItems.map(({ icon: Icon, title, body }, index) => (
                  <li
                    key={`${title}-${index}`}
                    className="reveal glass-card card-glow flex gap-3 p-5"
                    style={{ transitionDelay: `${index * 80}ms` }}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <div>
                      <p className="font-medium text-white">{title}</p>
                      <p className="mt-1 text-sm text-zinc-400">{body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="reveal">
              <div className="section-hairline mb-8 hero-glow-breathe" />
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-300/80">
                Reviews
              </p>
              <div className="mt-4 space-y-4">
                <ProductReviewForm productSlug={product.slug} />
                <div className="space-y-3">
                  {reviews.length < 1 ? (
                    <p className="text-sm text-zinc-500">No ratings yet — be the first.</p>
                  ) : (
                    reviews.map((r, i) => (
                      <div
                        key={r.id}
                        className="reveal glass-card p-4"
                        style={{ transitionDelay: `${i * 60}ms` }}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-xs text-zinc-500">{r.email}</p>
                          <p className="text-sm text-amber-300">
                            <span aria-hidden>{"★".repeat(r.rating)}</span>
                            <span className="text-amber-300/30" aria-hidden>
                              {"★".repeat(5 - r.rating)}
                            </span>
                            <span className="sr-only">{r.rating} of 5 stars</span>
                          </p>
                        </div>
                        <p className="mt-2 text-sm text-zinc-300">{r.message}</p>
                        {r.admin_reply ? (
                          <div className="mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-100">
                            <span className="font-semibold text-emerald-200">
                              Admin reply ·
                            </span>{" "}
                            {r.admin_reply}
                          </div>
                        ) : null}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="reveal">
              <div className="section-hairline mb-8 hero-glow-breathe" />
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-300/80">
                Comments
              </p>
              <div className="mt-4 space-y-4">
                <ProductCommentForm productSlug={product.slug} />
                <div className="space-y-3">
                  {comments.length < 1 ? (
                    <p className="text-sm text-zinc-500">No comments yet.</p>
                  ) : (
                    comments.map((c, i) => (
                      <div
                        key={c.id}
                        className="reveal glass-card p-4"
                        style={{ transitionDelay: `${i * 60}ms` }}
                      >
                        <div className="flex items-start gap-3">
                          <Quote
                            className="mt-1 h-3.5 w-3.5 shrink-0 text-emerald-400/70"
                            aria-hidden
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-zinc-500">{c.email}</p>
                            <p className="mt-1 text-sm text-zinc-300">{c.message}</p>
                            {c.admin_reply ? (
                              <div className="mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-100">
                                <span className="font-semibold text-emerald-200">
                                  <MessageSquare
                                    className="mr-1 inline h-3 w-3"
                                    aria-hidden
                                  />
                                  Admin reply ·
                                </span>{" "}
                                {c.admin_reply}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>

          <aside className="w-full flex-1 space-y-6 lg:sticky lg:top-24 lg:max-w-md">
            <div className="reveal glass-card overflow-hidden shadow-2xl shadow-black/40">
              <div className="aspect-video bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950">
                <ProductDemo demo={demo} productName={product.name} />
              </div>
              <div className="space-y-1 border-t border-white/10 px-6 py-5">
                <p className="text-sm font-medium text-white">Product demo</p>
                <p className="text-sm text-zinc-500">
                  Watch the live preview, then continue to checkout below.
                </p>
              </div>
            </div>

            <div className="reveal" style={{ transitionDelay: "120ms" }}>
              <CheckoutForm
                productSlug={product.slug}
                productName={product.name}
                priceLabel={priceLabel}
              />
            </div>
          </aside>
          </div>

          <CtaBanner
            title={
              <>
                Looking for more?{" "}
                <span className="hero-shimmer">Browse the full catalog.</span>
              </>
            }
            description="Tools, bots, courses, and dashboards — every product ships with secure checkout and instant delivery."
          />
        </main>
      </div>
    </StoreChrome>
  );
}
