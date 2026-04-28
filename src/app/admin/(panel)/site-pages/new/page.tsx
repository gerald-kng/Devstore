import { StaticPageForm } from "@/components/admin/StaticPageForm";
import { isSupabaseConfigured } from "@/lib/env";

export default async function NewStaticPage() {
  if (!isSupabaseConfigured()) {
    return <p>Supabase is not configured.</p>;
  }
  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">New site page</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Page will be available at <code>/c/your-slug</code> when published.
      </p>
      <div className="mt-6">
        <StaticPageForm
          initial={{
            slug: "",
            title: "",
            body: "",
            is_published: false,
            nav_label: "",
            show_in_header: false,
            show_in_footer: false,
            sort_order: 0,
          }}
        />
      </div>
    </div>
  );
}
