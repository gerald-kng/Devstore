import { createAdminClient } from "@/lib/supabase/admin";
import type { ProductRow } from "@/types/product";
import type { DeliveryStoragePaths } from "@/lib/storage";

/**
 * Resolves paid download + install video paths, preferring structured product_videos rows.
 */
export async function resolveProductDeliveryPaths(
  product: ProductRow,
): Promise<DeliveryStoragePaths> {
  const supabase = createAdminClient();
  const { data: videos, error: vErr } = await supabase
    .from("product_videos")
    .select("kind, storage_path")
    .eq("product_id", product.id)
    .order("sort_order", { ascending: true });
  if (vErr) {
    return {
      appStoragePath: product.app_storage_path,
      videoStoragePath: product.video_storage_path,
    };
  }

  const appPath = product.app_storage_path;
  const fromInstall = videos?.find(
    (v) =>
      (v as { kind: string }).kind === "install" &&
      (v as { storage_path: string | null }).storage_path,
  ) as { storage_path: string } | undefined;
  const videoPath =
    fromInstall?.storage_path && fromInstall.storage_path.length > 0
      ? fromInstall.storage_path
      : product.video_storage_path;

  return {
    appStoragePath: appPath,
    videoStoragePath: videoPath,
  };
}
