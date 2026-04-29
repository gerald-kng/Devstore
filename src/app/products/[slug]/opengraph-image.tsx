import { ImageResponse } from "next/og";
import { getCategoryById } from "@/lib/categories";
import {
  formatProductPrice,
  getProductBySlug,
  isValidProductSlug,
} from "@/lib/products";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/seo";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${SITE_NAME} product`;

type Props = { params: Promise<{ slug: string }> };

export default async function Image({ params }: Props) {
  const { slug } = await params;

  let title = SITE_NAME;
  let categoryLabel = SITE_TAGLINE;
  let priceLabel = "";

  if (isValidProductSlug(slug)) {
    const product = await getProductBySlug(slug).catch(() => null);
    if (product) {
      title = product.name;
      priceLabel = formatProductPrice(product);
      if (product.category_id) {
        const category = await getCategoryById(product.category_id).catch(
          () => null,
        );
        if (category) {
          categoryLabel = category.name;
        }
      }
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#09090b",
          backgroundImage:
            "radial-gradient(1000px 600px at 0% 0%, rgba(16,185,129,0.20), transparent 60%), radial-gradient(900px 500px at 100% 100%, rgba(34,211,238,0.15), transparent 60%)",
          color: "#f4f4f5",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#a1a1aa",
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 4,
              backgroundColor: "#10b981",
            }}
          />
          {SITE_NAME}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              padding: "8px 18px",
              borderRadius: 999,
              border: "1px solid rgba(16,185,129,0.4)",
              backgroundColor: "rgba(16,185,129,0.12)",
              color: "#6ee7b7",
              fontSize: 26,
              fontWeight: 500,
            }}
          >
            {categoryLabel}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: title.length > 40 ? 64 : 80,
              fontWeight: 700,
              lineHeight: 1.05,
              color: "#ffffff",
              maxWidth: 1040,
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
            paddingTop: 32,
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: "#a1a1aa",
              fontWeight: 500,
            }}
          >
            Crypto checkout. Instant delivery.
          </div>
          {priceLabel ? (
            <div
              style={{
                display: "flex",
                fontSize: 44,
                fontWeight: 700,
                color: "#34d399",
              }}
            >
              {priceLabel}
            </div>
          ) : null}
        </div>
      </div>
    ),
    size,
  );
}
