import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/env";

export type StaticPageNav = {
  id: string;
  slug: string;
  title: string;
  nav_label: string | null;
  sort_order: number;
};

export async function getHeaderNavLinks(): Promise<StaticPageNav[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }
  const db = createAdminClient();
  const { data, error } = await db
    .from("static_pages")
    .select("id, slug, title, nav_label, sort_order")
    .eq("is_published", true)
    .eq("show_in_header", true)
    .order("sort_order", { ascending: true });
  if (error) {
    return [];
  }
  return (data ?? []) as StaticPageNav[];
}

export async function getFooterNavLinks(): Promise<StaticPageNav[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }
  const db = createAdminClient();
  const { data, error } = await db
    .from("static_pages")
    .select("id, slug, title, nav_label, sort_order")
    .eq("is_published", true)
    .eq("show_in_footer", true)
    .order("sort_order", { ascending: true });
  if (error) {
    return [];
  }
  return (data ?? []) as StaticPageNav[];
}

export async function getCmsPageBySlug(
  slug: string,
): Promise<{ title: string; body: string } | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }
  const db = createAdminClient();
  const { data, error } = await db
    .from("static_pages")
    .select("title, body")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (error || !data) {
    return null;
  }
  return { title: data.title, body: data.body };
}
