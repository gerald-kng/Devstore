import { notFound } from "next/navigation";
import { StaticPageForm } from "@/components/admin/StaticPageForm";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/env";
import { isUuid } from "@/lib/validation";

type P = { params: Promise<{ id: string }> };

export default async function EditSitePagePage({ params }: P) {
  const { id } = await params;
  if (!isUuid(id)) {
    notFound();
  }
  if (!isSupabaseConfigured()) {
    return <p>Supabase is not configured.</p>;
  }
  const db = createAdminClient();
  const { data, error } = await db
    .from("static_pages")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) {
    notFound();
  }
  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Edit page</h1>
      <div className="mt-6">
        <StaticPageForm
          id={id}
          initial={{
            slug: data.slug,
            title: data.title,
            body: data.body,
            is_published: data.is_published,
            nav_label: data.nav_label ?? "",
            show_in_header: data.show_in_header,
            show_in_footer: data.show_in_footer,
            sort_order: data.sort_order,
          }}
        />
      </div>
    </div>
  );
}
