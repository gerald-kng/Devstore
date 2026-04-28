import { isSupabaseConfigured } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ProductListItem, ProductRow } from "@/types/product";

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidProductSlug(slug: string): boolean {
  return slug.length > 0 && slug.length <= 80 && SLUG_REGEX.test(slug);
}

function mapListRow(
  row: Record<string, unknown>,
): ProductListItem {
  const pc = row.product_categories as
    | { name: string; slug: string }
    | null
    | undefined;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { product_categories: _c, ...rest } = row;
  return {
    ...(rest as unknown as ProductRow),
    category: pc ? { name: pc.name, slug: pc.slug } : null,
  };
}

export async function listActiveProducts(): Promise<ProductListItem[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }
  const supabase = createAdminClient();
  const withJoin = await supabase
    .from("products")
    .select("*, product_categories (name, slug)")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (withJoin.error) {
    const simple = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });
    if (simple.error) {
      if (simple.error.code === "PGRST205") {
        console.error(
          "[products] Table missing: run supabase/migrations in order in the Supabase SQL Editor.",
        );
      } else {
        console.error(simple.error);
      }
      return [];
    }
    return (simple.data ?? []).map((p) => {
      const row = p as ProductRow;
      return {
        ...row,
        description: row.description ?? "",
        category_id: row.category_id ?? null,
        main_image_path: row.main_image_path ?? null,
        category: null,
      };
    });
  }
  return (withJoin.data ?? []).map((r) =>
    mapListRow(r as unknown as Record<string, unknown>),
  );
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductRow | null> {
  if (!isValidProductSlug(slug)) {
    return null;
  }
  if (!isSupabaseConfigured()) {
    return null;
  }
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    if (error.code === "PGRST205") {
      console.error(
        "[products] Table missing: run supabase/migrations in order (see SQL Editor).",
      );
    } else {
      console.error(error);
    }
    return null;
  }
  return normalizeProductRow(data as ProductRow) as ProductRow | null;
}

function normalizeProductRow(p: ProductRow | null): ProductRow | null {
  if (!p) {
    return null;
  }
  return {
    ...p,
    description: p.description ?? "",
    category_id: p.category_id ?? null,
    main_image_path: p.main_image_path ?? null,
  };
}

export async function getProductById(id: string): Promise<ProductRow | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    if (error.code === "PGRST205") {
      console.error(
        "[products] Table missing: run supabase/migrations in order (see SQL Editor).",
      );
    } else {
      console.error(error);
    }
    return null;
  }
  return normalizeProductRow(data as ProductRow) as ProductRow | null;
}

export function formatProductPrice(product: ProductRow): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: product.price_currency.toUpperCase(),
  }).format(Number(product.price_amount));
}
