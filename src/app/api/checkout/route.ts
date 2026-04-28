import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPublicAppUrl, isSupabaseConfigured } from "@/lib/env";
import { createNowPaymentsInvoice } from "@/lib/nowpayments";
import { isValidProductSlug } from "@/lib/products";
import { isValidEmail } from "@/lib/validation";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured" },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const record = body as Record<string, unknown>;

  const customerEmail =
    typeof record.customerEmail === "string" ? record.customerEmail.trim() : "";

  const productSlug =
    typeof record.productSlug === "string" ? record.productSlug.trim() : "";

  if (!isValidProductSlug(productSlug)) {
    return NextResponse.json({ error: "Invalid product" }, { status: 400 });
  }

  if (!isValidEmail(customerEmail)) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("*")
    .eq("slug", productSlug)
    .eq("is_active", true)
    .maybeSingle();

  if (productError) {
    console.error("Checkout product lookup failed", productError);
    return NextResponse.json(
      {
        error:
          "Could not verify product right now. Please retry in a moment.",
      },
      { status: 503 },
    );
  }
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const baseUrl = getPublicAppUrl().replace(/\/$/, "");
  const amount = Number(product.price_amount);
  const currency = product.price_currency.toLowerCase();

  const { data: order, error: insertError } = await supabase
    .from("orders")
    .insert({
      customer_email: customerEmail,
      status: "pending",
      payment_provider: "nowpayments",
      amount,
      currency,
      product_id: product.id,
    })
    .select("id")
    .single();

  if (insertError || !order) {
    console.error(insertError);
    return NextResponse.json(
      { error: "Unable to create order" },
      { status: 500 },
    );
  }

  const ipnCallbackUrl = `${baseUrl}/api/webhooks/crypto`;
  const successUrl = `${baseUrl}/success/${order.id}`;
  const cancelUrl = `${baseUrl}/products/${product.slug}`;

  try {
    const invoice = await createNowPaymentsInvoice({
      priceAmount: amount,
      priceCurrency: currency,
      orderId: order.id,
      orderDescription: `${product.name} — digital download`,
      ipnCallbackUrl,
      successUrl,
      cancelUrl,
    });

    const { error: updateError } = await supabase
      .from("orders")
      .update({
        invoice_id: String(invoice.id),
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id);

    if (updateError) {
      console.error(updateError);
      return NextResponse.json(
        { error: "Invoice created but order update failed" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      invoiceUrl: invoice.invoice_url,
      orderId: order.id,
    });
  } catch (error) {
    console.error(error);
    await supabase
      .from("orders")
      .update({
        status: "failed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id);

    return NextResponse.json(
      { error: "Payment provider error" },
      { status: 502 },
    );
  }
}
