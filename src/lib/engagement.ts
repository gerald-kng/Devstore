import { createAdminClient } from "@/lib/supabase/admin";

export type ProductComment = {
  id: string;
  email: string;
  message: string;
  admin_reply: string | null;
  created_at: string;
};

export type SiteReview = {
  id: string;
  email: string;
  rating: number;
  message: string;
  admin_reply: string | null;
  created_at: string;
};

export type ProductReview = {
  id: string;
  email: string;
  rating: number;
  message: string;
  admin_reply: string | null;
  created_at: string;
};

export async function listProductComments(productId: string): Promise<ProductComment[]> {
  const db = createAdminClient();
  const { data, error } = await db
    .from("product_comments")
    .select("id, email, message, admin_reply, created_at")
    .eq("product_id", productId)
    .eq("is_deleted", false)
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) {
    return [];
  }
  return (data ?? []) as ProductComment[];
}

export async function listSiteReviews(limit = 6): Promise<SiteReview[]> {
  const db = createAdminClient();
  const { data, error } = await db
    .from("site_reviews")
    .select("id, email, rating, message, admin_reply, created_at")
    .eq("is_deleted", false)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    return [];
  }
  return (data ?? []) as SiteReview[];
}

export async function listProductReviews(productId: string): Promise<ProductReview[]> {
  const db = createAdminClient();
  const { data, error } = await db
    .from("product_reviews")
    .select("id, email, rating, message, admin_reply, created_at")
    .eq("product_id", productId)
    .eq("is_deleted", false)
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) {
    return [];
  }
  return (data ?? []) as ProductReview[];
}
