import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/env";

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

export async function listActiveCategoryRows(): Promise<CategoryRow[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("product_categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) {
    return [];
  }
  return (data ?? []) as CategoryRow[];
}

export async function listAllCategoryRows(): Promise<CategoryRow[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("product_categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) {
    return [];
  }
  return (data ?? []) as CategoryRow[];
}

export async function getCategoryById(
  id: string,
): Promise<CategoryRow | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("product_categories")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) {
    return null;
  }
  return data as CategoryRow;
}
