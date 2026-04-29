import type { MetadataRoute } from "next";
import { listActiveCategoryRows } from "@/lib/categories";
import { listActiveProducts } from "@/lib/products";
import { siteUrl } from "@/lib/seo";
import { getFooterNavLinks, getHeaderNavLinks } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: siteUrl("/products"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: siteUrl("/courses"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: siteUrl("/contact"), lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: siteUrl("/terms"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: siteUrl("/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const [products, categories, headerPages, footerPages] = await Promise.all([
    listActiveProducts().catch(() => []),
    listActiveCategoryRows().catch(() => []),
    getHeaderNavLinks().catch(() => []),
    getFooterNavLinks().catch(() => []),
  ]);

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: siteUrl(`/products/${product.slug}`),
    lastModified: product.created_at ? new Date(product.created_at) : now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${siteUrl("/products")}?category=${encodeURIComponent(category.slug)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  const cmsBySlug = new Map<string, { slug: string }>();
  for (const page of [...headerPages, ...footerPages]) {
    cmsBySlug.set(page.slug, { slug: page.slug });
  }
  const cmsRoutes: MetadataRoute.Sitemap = [...cmsBySlug.values()].map((page) => ({
    url: siteUrl(`/c/${page.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes, ...cmsRoutes];
}
