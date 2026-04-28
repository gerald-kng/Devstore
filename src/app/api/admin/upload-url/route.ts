import { NextResponse } from "next/server";
import { getServiceRoleIfAdmin } from "@/lib/auth/get-admin";
import { createR2UploadSignedUrl } from "@/lib/r2";
import { isR2Configured } from "@/lib/env";

const ALLOWED_BUCKETS = new Set(["product-images", "downloads"]);

export async function POST(request: Request) {
  const ctx = await getServiceRoleIfAdmin();
  if (!ctx) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const record = (body ?? {}) as Record<string, unknown>;
  const bucket = String(record.bucket ?? "");
  const filename = String(record.filename ?? "");
  const prefix = String(record.prefix ?? "uploads").replace(/[^a-z0-9/_-]/gi, "");
  const upsert = Boolean(record.upsert ?? true);
  const contentType = String(record.contentType ?? "").trim();

  if (!ALLOWED_BUCKETS.has(bucket)) {
    return NextResponse.json({ error: "Invalid bucket" }, { status: 400 });
  }
  if (!filename) {
    return NextResponse.json({ error: "Missing filename" }, { status: 400 });
  }

  const ext = filename.split(".").pop()?.replace(/[^a-z0-9]/gi, "") || "bin";
  const objectPath = `${prefix.replace(/^\/+/, "")}/${crypto.randomUUID()}.${ext}`;

  if (bucket === "downloads" && isR2Configured()) {
    try {
      const signed = await createR2UploadSignedUrl({
        prefix,
        filename,
        contentType,
      });
      return NextResponse.json({
        bucket,
        path: signed.path,
        signedUrl: signed.signedUrl,
        uploadHeaders: signed.uploadHeaders,
        provider: "r2",
        publicUrl: null,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not sign R2 upload URL";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  const { data: buckets, error: listErr } = await ctx.db.storage.listBuckets();
  if (listErr) {
    return NextResponse.json(
      { error: `Could not verify storage buckets: ${listErr.message}` },
      { status: 500 },
    );
  }
  const bucketExists = (buckets ?? []).some((b) => b.name === bucket);
  if (!bucketExists) {
    return NextResponse.json(
      {
        error: `Storage bucket "${bucket}" does not exist. Create it in Supabase Storage first.`,
      },
      { status: 404 },
    );
  }

  const { data, error } = await ctx.db.storage
    .from(bucket)
    .createSignedUploadUrl(objectPath, { upsert });

  if (error || !data) {
    const message =
      error?.message?.includes("related resource does not exist")
        ? `Storage bucket "${bucket}" is missing or inaccessible.`
        : error?.message ?? "Could not create signed upload URL";
    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }

  return NextResponse.json({
    bucket,
    path: data.path,
    token: data.token,
    signedUrl: data.signedUrl,
    uploadHeaders: {
      "content-type": contentType || "application/octet-stream",
      "x-upsert": "true",
    },
    provider: "supabase",
    publicUrl:
      bucket === "product-images"
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${data.path}`
        : null,
  });
}

export const dynamic = "force-dynamic";
