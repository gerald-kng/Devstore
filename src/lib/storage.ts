import { createAdminClient } from "@/lib/supabase/admin";
import { getStorageDeliveryConfig, isR2Configured } from "@/lib/env";
import { createR2DownloadSignedUrl } from "@/lib/r2";

export type DeliverySignedUrls = {
  appDownloadUrl: string;
  videoDownloadUrl: string;
  expiresInSeconds: number;
};

export type DeliveryStoragePaths = {
  appStoragePath: string;
  videoStoragePath: string;
};

/**
 * Creates fresh Supabase Storage signed URLs on the server. Never call from the client.
 */
export async function createDeliverySignedUrls(
  paths: DeliveryStoragePaths,
): Promise<DeliverySignedUrls> {
  const { bucket, signedUrlTtlSeconds } = getStorageDeliveryConfig();

  if (isR2Configured()) {
    const [appDownloadUrl, videoDownloadUrl] = await Promise.all([
      createR2DownloadSignedUrl(paths.appStoragePath),
      createR2DownloadSignedUrl(paths.videoStoragePath),
    ]);
    return {
      appDownloadUrl,
      videoDownloadUrl,
      expiresInSeconds: signedUrlTtlSeconds,
    };
  }

  const supabase = createAdminClient();

  const [appResult, videoResult] = await Promise.all([
    supabase.storage
      .from(bucket)
      .createSignedUrl(paths.appStoragePath, signedUrlTtlSeconds),
    supabase.storage
      .from(bucket)
      .createSignedUrl(paths.videoStoragePath, signedUrlTtlSeconds),
  ]);

  if (appResult.error) {
    throw new Error(`Failed to sign app object: ${appResult.error.message}`);
  }
  if (videoResult.error) {
    throw new Error(`Failed to sign video object: ${videoResult.error.message}`);
  }

  return {
    appDownloadUrl: appResult.data.signedUrl,
    videoDownloadUrl: videoResult.data.signedUrl,
    expiresInSeconds: signedUrlTtlSeconds,
  };
}
