import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function AdminSitePagesPage() {
  if (!isSupabaseConfigured()) {
    return <p>Supabase is not configured.</p>;
  }
  const db = createAdminClient();
  const { data, error } = await db
    .from("static_pages")
    .select("id, slug, title, is_published, show_in_header, show_in_footer, sort_order")
    .order("sort_order", { ascending: true });
  if (error) {
    return <p className="text-red-400">Run migration 003 or check table static_pages. {error.message}</p>;
  }
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Site pages</h1>
        <Link
          className="rounded-lg bg-emerald-500 px-3 py-1.5 text-sm text-zinc-950"
          href="/admin/site-pages/new"
        >
          New page
        </Link>
      </div>
      <p className="mt-1 text-sm text-zinc-500">
        Public pages (About, terms, etc.) and header/footer nav links.
      </p>
      <ul className="mt-6 space-y-2">
        {(data ?? []).map((p) => (
          <li
            key={p.id}
            className="flex items-center justify-between rounded-lg border border-zinc-800 px-3 py-2"
          >
            <div>
              <span className="text-white">{p.title}</span>{" "}
              <code className="text-xs text-zinc-500">/c/{p.slug}</code>
              {!p.is_published ? (
                <span className="ml-2 text-amber-400/90">(draft)</span>
              ) : null}
            </div>
            <Link className="text-sm text-emerald-400" href={`/admin/site-pages/${p.id}/edit`}>
              Edit
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
