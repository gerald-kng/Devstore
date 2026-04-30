import {
  ArrowUpRight,
  Briefcase,
  FileText,
  ListOrdered,
  MessageSquare,
  Package,
} from "lucide-react";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/env";

const statCards = [
  {
    href: "/admin/products",
    label: "Products",
    icon: Package,
    tone: "text-sky-400 bg-sky-500/15 border-sky-500/20",
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: ListOrdered,
    tone: "text-violet-400 bg-violet-500/15 border-violet-500/20",
  },
  {
    href: "/admin/site-pages",
    label: "Site pages",
    icon: FileText,
    tone: "text-amber-400 bg-amber-500/15 border-amber-500/20",
  },
  {
    href: "/admin/engagement",
    label: "Engagement",
    icon: MessageSquare,
    tone: "text-cyan-400 bg-cyan-500/15 border-cyan-500/20",
  },
  {
    href: "/admin/hire",
    label: "Open hires",
    icon: Briefcase,
    tone: "text-emerald-400 bg-emerald-500/15 border-emerald-500/20",
  },
] as const;

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

  const counts = [productCount, orderCount, pageCount, engagementCount, openHireCount] as const;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 shadow-xl shadow-black/20 sm:p-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="relative">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
            Overview
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Dashboard
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-400">
            Manage your catalog, orders, site content, and inbound requests from one place. Jump
            into any area below.
          </p>
        </div>
      </div>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          const value = counts[i];
          return (
            <li key={card.href}>
              <Link
                href={card.href}
                className="group relative flex h-full flex-col rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-5 shadow-sm transition-all hover:border-zinc-700/90 hover:bg-zinc-900/55 hover:shadow-lg hover:shadow-black/25"
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`inline-flex rounded-xl border p-2.5 ${card.tone}`}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <ArrowUpRight
                    className="h-4 w-4 shrink-0 text-zinc-600 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-zinc-400"
                    aria-hidden
                  />
                </div>
                <p className="mt-4 text-sm font-medium text-zinc-400">{card.label}</p>
                <p className="mt-1 text-3xl font-semibold tabular-nums tracking-tight text-white">
                  {value}
                </p>
                <span className="mt-3 text-xs text-zinc-600 transition-colors group-hover:text-zinc-500">
                  Open in admin →
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
