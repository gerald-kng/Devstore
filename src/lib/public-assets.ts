const IMAGE_BUCKET = "product-images";

export function getPublicObjectUrl(bucket: string, objectPath: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base || !objectPath) {
    return null;
  }
  const key = objectPath.replace(/^\/+/, "");
  return `${base}/storage/v1/object/public/${bucket}/${encodeURI(key)}`;
}

export function getProductMainImageUrl(mainImagePath: string | null | undefined) {
  if (!mainImagePath) {
    return null;
  }
  return getPublicObjectUrl(IMAGE_BUCKET, mainImagePath);
}

export { IMAGE_BUCKET };
