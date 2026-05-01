import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getR2Config, getStorageDeliveryConfig, isR2Configured } from "@/lib/env";

function createR2Client() {
  const cfg = getR2Config();
  return new S3Client({
    region: "auto",
    endpoint: cfg.endpoint,
    credentials: {
      accessKeyId: cfg.accessKeyId,
      secretAccessKey: cfg.secretAccessKey,
    },
    forcePathStyle: true,
  });
}

function safeObjectPath(prefix: string, filename: string): string {
  const p = prefix.replace(/[^a-z0-9/_-]/gi, "").replace(/^\/+/, "");
  const ext = filename.split(".").pop()?.replace(/[^a-z0-9]/gi, "") || "bin";
  return `${p}/${crypto.randomUUID()}.${ext}`;
}

export type R2UploadSignedUrl = {
  path: string;
  signedUrl: string;
  uploadHeaders: Record<string, string>;
};

export async function createR2UploadSignedUrl(args: {
  prefix: string;
  filename: string;
  contentType?: string;
}): Promise<R2UploadSignedUrl> {
  if (!isR2Configured()) {
    throw new Error("R2 is not configured");
  }
  const cfg = getR2Config();
  const path = safeObjectPath(args.prefix, args.filename);
  const contentType = args.contentType?.trim() || "application/octet-stream";
  const client = createR2Client();
  const command = new PutObjectCommand({
    Bucket: cfg.bucket,
    Key: path,
    ContentType: contentType,
  });
  const signedUrl = await getSignedUrl(client, command, {
    expiresIn: cfg.signedUrlTtlSeconds,
  });
  return {
    path,
    signedUrl,
    uploadHeaders: { "content-type": contentType },
  };
}

/** Server-side upload (avoids browser CORS on the R2 S3 endpoint). */
export async function uploadR2Object(
  key: string,
  body: Uint8Array,
  contentType: string,
): Promise<void> {
  if (!isR2Configured()) {
    throw new Error("R2 is not configured");
  }
  const cfg = getR2Config();
  const client = createR2Client();
  await client.send(
    new PutObjectCommand({
      Bucket: cfg.bucket,
      Key: key.replace(/^\/+/, ""),
      Body: body,
      ContentType: contentType || "application/octet-stream",
    }),
  );
}

export async function createR2DownloadSignedUrl(path: string): Promise<string> {
  if (!isR2Configured()) {
    throw new Error("R2 is not configured");
  }
  const cfg = getR2Config();
  const { signedUrlTtlSeconds } = getStorageDeliveryConfig();
  const client = createR2Client();
  const command = new GetObjectCommand({
    Bucket: cfg.bucket,
    Key: path.replace(/^\/+/, ""),
  });
  return getSignedUrl(client, command, { expiresIn: signedUrlTtlSeconds });
}
