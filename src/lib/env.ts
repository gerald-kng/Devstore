function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function clean(value: string): string {
  return value.trim();
}

function ensureNoPlaceholders(name: string, value: string) {
  if (value.includes("<") || value.includes(">")) {
    throw new Error(
      `Invalid ${name}: remove angle brackets and paste the real value.`,
    );
  }
}

export function getPublicAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

/** Supabase magic-link redirects: prefer NEXT_PUBLIC_APP_URL so prod emails use the canonical domain (not localhost from dev or odd proxy hosts). Falls back to the current browser origin when unset (local dev). */
export function getClientAuthRedirectBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (configured) {
    return configured.replace(/\/+$/, "");
  }
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return "http://localhost:3000";
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.length &&
      process.env.SUPABASE_SERVICE_ROLE_KEY?.length,
  );
}

export function getSupabaseAdminConfig() {
  return {
    url: required("NEXT_PUBLIC_SUPABASE_URL"),
    serviceRoleKey: required("SUPABASE_SERVICE_ROLE_KEY"),
  };
}

export function getNowPaymentsConfig() {
  return {
    apiKey: required("NOWPAYMENTS_API_KEY"),
    ipnSecret: required("NOWPAYMENTS_IPN_SECRET"),
  };
}

export function getOrderAccessSecret(): string {
  return process.env.ORDER_ACCESS_TOKEN_SECRET ?? required("SUPABASE_SERVICE_ROLE_KEY");
}

export function getStorageDeliveryConfig() {
  return {
    bucket: process.env.SUPABASE_DELIVERY_BUCKET ?? "downloads",
    signedUrlTtlSeconds: Number(
      process.env.SUPABASE_SIGNED_URL_TTL_SECONDS ?? "3600",
    ),
  };
}

export function isR2Configured(): boolean {
  return Boolean(
    process.env.R2_ENDPOINT &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET,
  );
}

export function getR2Config() {
  const endpoint = clean(required("R2_ENDPOINT"));
  const accessKeyId = clean(required("R2_ACCESS_KEY_ID"));
  const secretAccessKey = clean(required("R2_SECRET_ACCESS_KEY"));
  const bucket = clean(required("R2_BUCKET"));

  ensureNoPlaceholders("R2_ENDPOINT", endpoint);
  ensureNoPlaceholders("R2_ACCESS_KEY_ID", accessKeyId);
  ensureNoPlaceholders("R2_SECRET_ACCESS_KEY", secretAccessKey);
  ensureNoPlaceholders("R2_BUCKET", bucket);

  let normalizedEndpoint = endpoint;
  if (!/^https?:\/\//i.test(normalizedEndpoint)) {
    normalizedEndpoint = `https://${normalizedEndpoint}`;
  }
  try {
    // Validate endpoint format early so upload API can return a readable setup error.
    void new URL(normalizedEndpoint);
  } catch {
    throw new Error(
      "Invalid R2_ENDPOINT. Use https://<accountid>.r2.cloudflarestorage.com",
    );
  }

  return {
    endpoint: normalizedEndpoint,
    accessKeyId,
    secretAccessKey,
    bucket,
    signedUrlTtlSeconds: Number(process.env.R2_SIGNED_URL_TTL_SECONDS ?? "3600"),
  };
}
