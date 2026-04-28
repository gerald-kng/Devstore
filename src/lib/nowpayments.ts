import { createHmac, timingSafeEqual } from "node:crypto";
import { getNowPaymentsConfig } from "@/lib/env";

function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortKeysDeep);
  }
  if (value && typeof value === "object" && value !== null) {
    const obj = value as Record<string, unknown>;
    return Object.keys(obj)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = sortKeysDeep(obj[key]);
        return acc;
      }, {});
  }
  return value;
}

/**
 * Validates NOWPayments IPN `x-nowpayments-sig` per their HMAC-SHA512 + sorted JSON rules.
 * @see https://nowpayments.zendesk.com/hc/en-us/articles/360000804572
 */
export function verifyNowPaymentsIpnSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string,
): boolean {
  if (!signatureHeader || !secret) {
    return false;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return false;
  }
  const sortedString = JSON.stringify(sortKeysDeep(parsed));
  const digest = createHmac("sha512", secret).update(sortedString).digest("hex");
  try {
    const a = Buffer.from(digest, "utf8");
    const b = Buffer.from(signatureHeader, "utf8");
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export type NowPaymentsIpnPayload = {
  order_id?: string;
  payment_status?: string;
  payment_id?: number | string;
  invoice_id?: string;
  price_amount?: number;
  price_currency?: string;
  actually_paid?: number;
  pay_currency?: string;
};

export function isNowPaymentsSuccessStatus(status: string | undefined): boolean {
  if (!status) return false;
  const normalized = status.toLowerCase();
  return normalized === "finished" || normalized === "confirmed";
}

export async function createNowPaymentsInvoice(input: {
  priceAmount: number;
  priceCurrency: string;
  orderId: string;
  orderDescription: string;
  ipnCallbackUrl: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<{ id: string; invoice_url: string }> {
  const { apiKey } = getNowPaymentsConfig();
  const response = await fetch("https://api.nowpayments.io/v1/invoice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({
      price_amount: input.priceAmount,
      price_currency: input.priceCurrency,
      order_id: input.orderId,
      order_description: input.orderDescription,
      ipn_callback_url: input.ipnCallbackUrl,
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
    }),
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(
      `NOWPayments invoice request failed (${response.status}): ${text}`,
    );
  }

  const data = JSON.parse(text) as { id: string; invoice_url: string };
  if (!data.invoice_url || !data.id) {
    throw new Error("NOWPayments response missing invoice fields");
  }
  return data;
}
