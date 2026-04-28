import Link from "next/link";
import {
  Boxes,
  FileText,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  MessageSquare,
  Package,
} from "lucide-react";
import { signOutAction } from "@/app/admin/actions";
import { createClient } from "@/lib/supabase/server";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/categories", label: "Categories", icon: Boxes },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ListOrdered },
  { href: "/admin/engagement", label: "Engagement", icon: MessageSquare },
  { href: "/admin/site-pages", label: "Site pages", icon: FileText },
] as const;

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-950 text-zinc-100 md:flex-row">
      <aside className="flex w-full flex-col border-b border-zinc-800 md:w-56 md:border-b-0 md:border-r">
        <div className="border-b border-zinc-800 p-4">
          <span className="text-sm font-semibold text-white">Orion admin</span>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 p-2">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <form action={signOutAction} className="p-2">
          <p className="mb-2 truncate px-1 text-xs text-zinc-600" title={user?.email ?? ""}>
            {user?.email}
          </p>
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </form>
        <div className="p-2">
          <Link
            href="/"
            className="block rounded-lg px-3 py-2 text-xs text-zinc-500 hover:text-emerald-400"
          >
            View storefront
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-8">{children}</main>
    </div>
  );
}
