import { NextResponse } from "next/server";
import { createOrderAccessLink } from "@/lib/access";
import { sendAccessLinkEmail } from "@/lib/email";
import { getProductById } from "@/lib/products";
import { createAdminClient } from "@/lib/supabase/admin";
import { isValidEmail, isUuid } from "@/lib/validation";

/**
 * Customer self-service endpoint to request access link re-send.
 * Always returns generic success to avoid leaking order existence.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: true }, { status: 200 });
  }
  const record = (body ?? {}) as Record<string, unknown>;
  const orderId =
    typeof record.orderId === "string" ? record.orderId.trim() : "";
  const email = typeof record.email === "string" ? record.email.trim() : "";
  if (!isUuid(orderId) || !isValidEmail(email)) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const db = createAdminClient();
  const { data: order } = await db
    .from("orders")
    .select("id, customer_email, product_id, status")
    .eq("id", orderId)
    .eq("customer_email", email)
    .eq("status", "paid")
    .maybeSingle();

  if (!order) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }
  const product = await getProductById(order.product_id);
  if (!product) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }
  const accessPortalUrl = await createOrderAccessLink(order.id);
  await sendAccessLinkEmail({
    to: order.customer_email,
    orderId: order.id,
    productName: product.name,
    accessPortalUrl,
  });
  return NextResponse.json({ ok: true }, { status: 200 });
}
