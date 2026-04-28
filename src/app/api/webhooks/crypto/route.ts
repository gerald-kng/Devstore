import { NextResponse } from "next/server";
import { createOrderAccessLink } from "@/lib/access";
import { createAdminClient } from "@/lib/supabase/admin";
import { getNowPaymentsConfig, isSupabaseConfigured } from "@/lib/env";
import { sendPurchaseEmail } from "@/lib/email";
import {
  isNowPaymentsSuccessStatus,
  verifyNowPaymentsIpnSignature,
  type NowPaymentsIpnPayload,
} from "@/lib/nowpayments";
import { getProductById } from "@/lib/products";
import { isUuid } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured" },
      { status: 503 },
    );
  }

  const rawBody = await request.text();
  const signature =
    request.headers.get("x-nowpayments-sig") ??
    request.headers.get("X-NOWPAYMENTS-SIG");

  let ipnSecret: string;
  try {
    ({ ipnSecret } = getNowPaymentsConfig());
  } catch {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  if (!verifyNowPaymentsIpnSignature(rawBody, signature, ipnSecret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: NowPaymentsIpnPayload;
  try {
    payload = JSON.parse(rawBody) as NowPaymentsIpnPayload;
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const orderId = payload.order_id;
  if (!orderId || !isUuid(orderId)) {
    return NextResponse.json({ ignored: true }, { status: 200 });
  }

  const supabase = createAdminClient();
  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("id, status, customer_email, product_id")
    .eq("id", orderId)
    .maybeSingle();

  if (fetchError || !order) {
    console.error(fetchError);
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.status === "paid") {
    return NextResponse.json({ ok: true, duplicate: true }, { status: 200 });
  }

  const paymentStatus = payload.payment_status;
  const providerPaymentId =
    payload.payment_id !== undefined && payload.payment_id !== null
      ? String(payload.payment_id)
      : null;

  if (isNowPaymentsSuccessStatus(paymentStatus)) {
    const paidAt = new Date().toISOString();

    const { data: transitioned, error: updateError } = await supabase
      .from("orders")
      .update({
        status: "paid",
        provider_payment_id: providerPaymentId,
        paid_at: paidAt,
        metadata: {
          invoice_id: payload.invoice_id ?? null,
          price_amount: payload.price_amount ?? null,
          price_currency: payload.price_currency ?? null,
          pay_currency: payload.pay_currency ?? null,
          actually_paid: payload.actually_paid ?? null,
        },
        updated_at: paidAt,
      })
      .eq("id", order.id)
      .eq("status", "pending")
      .select("id")
      .maybeSingle();

    if (updateError) {
      console.error(updateError);
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }

    if (!transitioned) {
      return NextResponse.json({ ok: true, duplicate: true }, { status: 200 });
    }

    try {
      const product = await getProductById(order.product_id);
      if (!product) {
        throw new Error("Product missing for order");
      }
      const accessPortalUrl = await createOrderAccessLink(order.id);
      await sendPurchaseEmail({
        to: order.customer_email,
        orderId: order.id,
        productName: product.name,
        accessPortalUrl,
      });
    } catch (deliveryError) {
      console.error("Post-payment delivery error", deliveryError);
      return NextResponse.json(
        { error: "Delivery pipeline failed" },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const failedLike = ["failed", "expired", "refunded"].includes(
    (paymentStatus ?? "").toLowerCase(),
  );

  if (failedLike) {
    await supabase
      .from("orders")
      .update({
        status: paymentStatus?.toLowerCase() === "expired" ? "expired" : "failed",
        provider_payment_id: providerPaymentId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id);
  }

  return NextResponse.json({ acknowledged: true }, { status: 200 });
}
