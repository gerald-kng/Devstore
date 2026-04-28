import { NextResponse } from "next/server";
import { getServiceRoleIfAdmin } from "@/lib/auth/get-admin";

const ALLOWED_BUCKETS = new Set(["product-images", "downloads"]);

export async function POST(request: Request) {
  const ctx = await getServiceRoleIfAdmin();
  if (!ctx) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      {
        error:
          "Could not parse upload body. The file is likely too large for the current request size limit.",
      },
      { status: 413 },
    );
  }
  const file = form.get("file");
  const bucketRaw = String(form.get("bucket") ?? "product-images");
  const prefix = String(form.get("prefix") ?? "uploads").replace(
    /[^a-z0-9/_-]/gi,
    "",
  );
  if (!ALLOWED_BUCKETS.has(bucketRaw)) {
    return NextResponse.json({ error: "Invalid bucket" }, { status: 400 });
  }
  if (!file || !(file instanceof File) || file.size < 1) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  const ext =
    file.name.split(".").pop()?.replace(/[^a-z0-9]/gi, "") || "bin";
  const objectPath = `${prefix.replace(/^\/+/, "")}/${crypto.randomUUID()}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const { data, error } = await ctx.db.storage
    .from(bucketRaw)
    .upload(objectPath, arrayBuffer, {
      contentType: file.type || "application/octet-stream",
      upsert: true,
    });
  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 },
    );
  }
  return NextResponse.json({
    path: data.path,
    bucket: bucketRaw,
    publicUrl:
      bucketRaw === "product-images"
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucketRaw}/${data.path}`
        : null,
  });
}

export const dynamic = "force-dynamic";
