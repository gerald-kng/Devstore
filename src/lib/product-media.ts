import { getPublicObjectUrl, IMAGE_BUCKET } from "@/lib/public-assets";
import { resolveStreamingDemoUrl } from "@/lib/demo-embed";
import { getStorageDeliveryConfig } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ProductRow } from "@/types/product";

export type DemoDisplay =
  | { kind: "iframe"; src: string }
  | { kind: "video"; src: string }
  | { kind: "placeholder" };

function displayFromHttpUrl(url: string | null | undefined): DemoDisplay | null {
  const resolved = resolveStreamingDemoUrl(url);
  if (!resolved) {
    return null;
  }
  if (resolved.player === "iframe") {
    return { kind: "iframe", src: resolved.src };
  }
  return { kind: "video", src: resolved.src };
}

export async function getProductDemoDisplay(
  product: ProductRow,
): Promise<DemoDisplay> {
  const supabase = createAdminClient();
  const { bucket: deliveryBucket, signedUrlTtlSeconds } = getStorageDeliveryConfig();

  // Prefer legacy column so it wins over empty demo rows and never uses install path as demo.
  const fromDemoColumn = displayFromHttpUrl(product.demo_video_url);
  if (fromDemoColumn) {
    return fromDemoColumn;
  }

  const { data: rows, error } = await supabase
    .from("product_videos")
    .select("external_url, storage_path")
    .eq("product_id", product.id)
    .eq("kind", "demo")
    .order("sort_order", { ascending: true })
    .limit(1);
  if (!error && rows?.[0]) {
    const r = rows[0] as {
      external_url: string | null;
      storage_path: string | null;
    };
    const fromExternal = displayFromHttpUrl(r.external_url);
    if (fromExternal) {
      return fromExternal;
    }
    if (r.storage_path) {
      if (r.storage_path.startsWith("https://") || r.storage_path.startsWith("http://")) {
        const fromStorageUrl = displayFromHttpUrl(r.storage_path);
        if (fromStorageUrl) {
          return fromStorageUrl;
        }
        return { kind: "video", src: r.storage_path };
      }
      const u = getPublicObjectUrl(IMAGE_BUCKET, r.storage_path);
      if (u) {
        return { kind: "video", src: u };
      }
      const signed = await supabase.storage
        .from(deliveryBucket)
        .createSignedUrl(r.storage_path, signedUrlTtlSeconds);
      if (!signed.error && signed.data?.signedUrl) {
        return { kind: "video", src: signed.data.signedUrl };
      }
    }
  }
  return { kind: "placeholder" };
}

export async function getProductImageGallery(
  productId: string,
): Promise<{ id: string; storage_path: string; alt_text: string }[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("product_images")
    .select("id, storage_path, alt_text")
    .eq("product_id", productId)
    .order("sort_order", { ascending: true });
  if (error) {
    return [];
  }
  return (data ?? []) as { id: string; storage_path: string; alt_text: string }[];
}
