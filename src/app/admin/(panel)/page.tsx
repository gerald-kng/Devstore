import {
  Briefcase,
  FileText,
  ListOrdered,
  MessageSquare,
  Package,
} from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/env";

export default async function AdminDashboard() {
  let productCount = 0;
  let orderCount = 0;
  let pageCount = 0;
  let engagementCount = 0;
  let openHireCount = 0;
  if (isSupabaseConfigured()) {
    const db = createAdminClient();
    const [p, o, s, c, r, h] = await Promise.all([
      db.from("products").select("id", { count: "exact", head: true }),
      db.from("orders").select("id", { count: "exact", head: true }),
      db.from("static_pages").select("id", { count: "exact", head: true }),
      db.from("product_comments").select("id", { count: "exact", head: true }).eq("is_deleted", false),
      db.from("product_reviews").select("id", { count: "exact", head: true }).eq("is_deleted", false),
      db.from("hire_requests").select("id", { count: "exact", head: true }).eq("is_handled", false),
    ]);
    productCount = p.count ?? 0;
    orderCount = o.count ?? 0;
    pageCount = s.count ?? 0;
    engagementCount = (c.count ?? 0) + (r.count ?? 0);
    openHireCount = h.count ?? 0;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Use the sidebar to manage catalog, files, and site content.
      </p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <li className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center gap-2 text-zinc-400">
            <Package className="h-5 w-5" />
            <span className="text-sm">Products</span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-white">{productCount}</p>
        </li>
        <li className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center gap-2 text-zinc-400">
            <ListOrdered className="h-5 w-5" />
            <span className="text-sm">Orders</span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-white">{orderCount}</p>
        </li>
        <li className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center gap-2 text-zinc-400">
            <FileText className="h-5 w-5" />
            <span className="text-sm">Site pages</span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-white">{pageCount}</p>
        </li>
        <li className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center gap-2 text-zinc-400">
            <MessageSquare className="h-5 w-5" />
            <span className="text-sm">Engagement</span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-white">{engagementCount}</p>
        </li>
        <li className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center gap-2 text-zinc-400">
            <Briefcase className="h-5 w-5" />
            <span className="text-sm">Open hires</span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-white">{openHireCount}</p>
        </li>
      </ul>
    </div>
  );
}
