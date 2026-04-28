import { createCategoryAction } from "@/app/admin/actions";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/env";
import {
  CategoryFormCreate,
  CategoryListTable,
} from "@/components/admin/CategoryForm";
import type { CategoryRow } from "@/lib/categories";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  if (!isSupabaseConfigured()) {
    return <p>Supabase is not configured.</p>;
  }
  const db = createAdminClient();
  const { data, error } = await db
    .from("product_categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) {
    return <p className="text-red-400">Could not load categories: {error.message}</p>;
  }
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-white">Categories</h1>
      <p className="text-sm text-zinc-500">
        Group products for the storefront. Slugs are URL-friendly (a-z, 0-9, hyphens).
      </p>
      <CategoryFormCreate
        action={createCategoryAction}
        title="Add category"
      />
      <CategoryListTable items={(data ?? []) as CategoryRow[]} />
    </div>
  );
}
