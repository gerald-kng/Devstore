import type { Metadata } from "next";
import { getPublicAppUrl } from "@/lib/env";

export const SITE_NAME = "Orion Dev Store";
export const SITE_TAGLINE = "Crypto-native digital marketplace";
export const SITE_DESCRIPTION =
  "Browse digital products with per-SKU pricing, demos, and crypto checkout. Secure delivery links and instant access after payment.";
export const SITE_KEYWORDS = [
  "digital products",
  "crypto checkout",
  "developer tools",
  "trading tools",
  "automation bots",
  "online courses",
  "Orion Dev Store",
];

export function siteUrl(path: string = "/"): string {
  const base = getPublicAppUrl().replace(/\/+$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}

export function absoluteImageUrl(image: string | null | undefined): string | null {
  if (!image) return null;
  if (/^https?:\/\//i.test(image)) return image;
  return siteUrl(image);
}

type RobotsMode = { index: boolean; follow: boolean };

export type BuildMetadataInput = {
  title?: string;
  description?: string;
  /** Canonical path (e.g. "/products"). Will be resolved against metadataBase. */
  path: string;
  /** Absolute or app-relative image URL. If unset, the route's opengraph-image.tsx file is used. */
  image?: string | null;
  imageAlt?: string;
  noindex?: boolean;
  ogType?: "website" | "article" | "profile";
};

export function buildMetadata(input: BuildMetadataInput): Metadata {
  const title = input.title;
  const description = input.description ?? SITE_DESCRIPTION;
  const canonical = input.path;

  const robots: RobotsMode = input.noindex
    ? { index: false, follow: false }
    : { index: true, follow: true };

  const meta: Metadata = {
    title,
    description,
    alternates: { canonical },
    robots,
    openGraph: {
      type: input.ogType ?? "website",
      url: canonical,
      title: title ?? undefined,
      description,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: title ?? undefined,
      description,
    },
  };

  if (input.image) {
    const url = input.image;
    const alt = input.imageAlt ?? title ?? SITE_NAME;
    meta.openGraph!.images = [{ url, alt, width: 1200, height: 630 }];
    meta.twitter!.images = [url];
  }

  return meta;
}

export function buildRootMetadata(): Metadata {
  const base: Metadata = {
    metadataBase: new URL(getPublicAppUrl()),
    title: {
      default: `${SITE_NAME} — ${SITE_TAGLINE}`,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    applicationName: SITE_NAME,
    keywords: SITE_KEYWORDS,
    alternates: { canonical: "/" },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url: "/",
      title: `${SITE_NAME} — ${SITE_TAGLINE}`,
      description: SITE_DESCRIPTION,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: `${SITE_NAME} — ${SITE_TAGLINE}`,
      description: SITE_DESCRIPTION,
    },
  };

  const verification: NonNullable<Metadata["verification"]> = {};
  const google = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
  const bing = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION?.trim();
  if (google) verification.google = google;
  if (bing) verification.other = { "msvalidate.01": bing };
  if (Object.keys(verification).length > 0) {
    base.verification = verification;
  }

  return base;
}

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: siteUrl("/"),
    logo: siteUrl("/favicon.ico"),
    description: SITE_DESCRIPTION,
  } as const;
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: siteUrl("/"),
    inLanguage: "en",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl("/products")}?category={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  } as const;
}

export type ProductLdInput = {
  name: string;
  slug: string;
  summary: string;
  description?: string | null;
  priceAmount: number;
  priceCurrency: string;
  image?: string | null;
  categoryName?: string | null;
};

export function productLd(p: ProductLdInput) {
  const description = (p.description && p.description.trim()) || p.summary;
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description,
    sku: p.slug,
    url: siteUrl(`/products/${p.slug}`),
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: {
      "@type": "Offer",
      url: siteUrl(`/products/${p.slug}`),
      priceCurrency: p.priceCurrency.toUpperCase(),
      price: Number(p.priceAmount).toFixed(2),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };
  if (p.categoryName) {
    data.category = p.categoryName;
  }
  if (p.image) {
    data.image = [p.image];
  }
  return data;
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: siteUrl(item.path),
    })),
  } as const;
}

export type ItemListEntry = { name: string; slug: string };

export function itemListLd(items: ItemListEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: siteUrl(`/products/${item.slug}`),
    })),
  } as const;
}
