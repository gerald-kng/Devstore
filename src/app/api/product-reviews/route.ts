import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/env";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Service unavailable." }, { status: 503 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const record = (body ?? {}) as Record<string, unknown>;
  const productSlug = String(record.productSlug ?? "").trim();
  const email = String(record.email ?? "").trim().toLowerCase();
  const message = String(record.message ?? "").trim();
  const rating = Number(record.rating ?? 0);
  if (!productSlug) {
    return NextResponse.json({ error: "Missing product." }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be between 1 and 5." }, { status: 400 });
  }
  if (message.length < 5) {
    return NextResponse.json({ error: "Review is too short." }, { status: 400 });
  }
  const db = createAdminClient();
  const { data: product } = await db
    .from("products")
    .select("id")
    .eq("slug", productSlug)
    .maybeSingle();
  if (!product?.id) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }
  const { error } = await db.from("product_reviews").insert({
    product_id: product.id,
    email,
    rating,
    message,
  });
  if (error) {
    return NextResponse.json({ error: "Could not submit review." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export const dynamic = "force-dynamic";
