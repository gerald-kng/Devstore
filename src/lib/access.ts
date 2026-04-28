import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { getOrderAccessSecret, getPublicAppUrl } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";

const DEFAULT_ACCESS_DAYS = 365;

function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

function createTokenForOrder(orderId: string): string {
  const secret = getOrderAccessSecret();
  const sig = createHmac("sha256", secret).update(orderId).digest("hex");
  return `${orderId}.${sig}`;
}

function isTokenSignatureValid(token: string): { orderId: string } | null {
  const parts = token.split(".");
  if (parts.length !== 2) {
    return null;
  }
  const [orderId, sig] = parts;
  if (!orderId || !sig) {
    return null;
  }
  const expected = createTokenForOrder(orderId).split(".")[1]!;
  try {
    const a = Buffer.from(sig, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length) {
      return null;
    }
    if (!timingSafeEqual(a, b)) {
      return null;
    }
  } catch {
    return null;
  }
  return { orderId };
}

function getAccessTtlDays(): number {
  const raw = Number(process.env.ORDER_ACCESS_TTL_DAYS ?? DEFAULT_ACCESS_DAYS);
  if (!Number.isFinite(raw) || raw < 1) {
    return DEFAULT_ACCESS_DAYS;
  }
  return Math.floor(raw);
}

function accessExpiryIso(): string {
  const days = getAccessTtlDays();
  const ms = days * 24 * 60 * 60 * 1000;
  return new Date(Date.now() + ms).toISOString();
}

export async function createOrderAccessLink(orderId: string): Promise<string> {
  const db = createAdminClient();
  const token = createTokenForOrder(orderId);
  const tokenHash = sha256(token);
  const expiresAt = accessExpiryIso();
  const { error } = await db
    .from("order_access_tokens")
    .upsert(
      {
        order_id: orderId,
        token_hash: tokenHash,
        expires_at: expiresAt,
        revoked_at: null,
      },
      { onConflict: "order_id" },
    );
  if (error) {
    throw new Error(`Failed to create access token: ${error.message}`);
  }
  const base = getPublicAppUrl().replace(/\/$/, "");
  return `${base}/access/${token}`;
}

export async function getPaidOrderByAccessToken(token: string): Promise<{
  orderId: string;
  productId: string;
  customerEmail: string;
} | null> {
  const db = createAdminClient();
  const parsed = isTokenSignatureValid(token);
  if (!parsed) {
    return null;
  }
  const tokenHash = sha256(token);
  const now = new Date().toISOString();

  const { data: access, error: accessError } = await db
    .from("order_access_tokens")
    .select("order_id, expires_at, revoked_at")
    .eq("token_hash", tokenHash)
    .is("revoked_at", null)
    .gt("expires_at", now)
    .maybeSingle();

  if (accessError || !access) {
    return null;
  }

  const { data: order, error: orderError } = await db
    .from("orders")
    .select("id, product_id, customer_email, status")
    .eq("id", access.order_id)
    .maybeSingle();

  if (orderError || !order || order.status !== "paid") {
    return null;
  }

  return {
    orderId: order.id,
    productId: order.product_id,
    customerEmail: order.customer_email,
  };
}

export async function revokeOrderAccess(orderId: string): Promise<void> {
  const db = createAdminClient();
  const { error } = await db
    .from("order_access_tokens")
    .update({ revoked_at: new Date().toISOString() })
    .eq("order_id", orderId);
  if (error) {
    throw new Error(error.message);
  }
}
