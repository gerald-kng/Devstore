export type ProductFeature = { title: string; body: string };

export function parseProductFeatures(raw: unknown): ProductFeature[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  const out: ProductFeature[] = [];
  for (const item of raw) {
    if (
      item &&
      typeof item === "object" &&
      "title" in item &&
      "body" in item &&
      typeof (item as { title: unknown }).title === "string" &&
      typeof (item as { body: unknown }).body === "string"
    ) {
      out.push({
        title: (item as { title: string }).title,
        body: (item as { body: string }).body,
      });
    }
  }
  return out;
}

export type ProductRow = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string;
  price_amount: number;
  price_currency: string;
  app_storage_path: string;
  video_storage_path: string;
  demo_video_url: string | null;
  features: unknown;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  category_id: string | null;
  main_image_path: string | null;
};

export type ProductListItem = ProductRow & {
  category: { name: string; slug: string } | null;
};

/** Extra storefront photos (`product_images`); main cover is `ProductRow.main_image_path`. */
export type ProductGalleryImageRow = {
  id: string;
  storage_path: string;
  alt_text: string;
};
