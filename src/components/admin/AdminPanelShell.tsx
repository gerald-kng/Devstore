"use client";

import Link from "next/link";
import {
  Boxes,
  Briefcase,
  FileText,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Share2,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { signOutAction } from "@/app/admin/actions";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/categories", label: "Categories", icon: Boxes },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ListOrdered },
  { href: "/admin/engagement", label: "Engagement", icon: MessageSquare },
  { href: "/admin/hire", label: "Hire requests", icon: Briefcase },
  { href: "/admin/site-pages", label: "Site pages", icon: FileText },
  { href: "/admin/social-links", label: "Social links", icon: Share2 },
] as const;

function navItemActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

type AdminPanelShellProps = {
  userEmail: string | null | undefined;
  children: React.ReactNode;
};

export function AdminPanelShell({ userEmail, children }: AdminPanelShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const sidebarBody = (
    <>
      <div className="border-b border-zinc-800/80 px-4 py-4 md:px-5">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">
          Console
        </p>
        <p className="mt-1 text-sm font-semibold tracking-tight text-white">Orion admin</p>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2 md:p-3" aria-label="Admin">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = navItemActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={
                active
                  ? "flex items-center gap-3 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3 py-2.5 text-sm font-medium text-emerald-300"
                  : "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-400 transition-colors hover:bg-zinc-800/80 hover:text-white"
              }
            >
              <Icon className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto border-t border-zinc-800/80 p-2 md:p-3">
        <form action={signOutAction}>
          <p className="mb-2 truncate px-1 text-xs text-zinc-500" title={userEmail ?? ""}>
            {userEmail}
          </p>
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-zinc-400 transition-colors hover:bg-zinc-800/80 hover:text-zinc-100"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </form>
        <Link
          href="/"
          className="mt-1 block rounded-lg px-3 py-2 text-xs text-zinc-500 transition-colors hover:bg-zinc-800/50 hover:text-emerald-400"
        >
          View storefront
        </Link>
      </div>
    </>
  );

  return (
    <div className="relative flex min-h-full flex-1 flex-col bg-gradient-to-br from-zinc-950 via-zinc-950 to-zinc-900 text-zinc-100 md:flex-row">
      <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-zinc-800/80 bg-zinc-950/90 px-4 backdrop-blur-md md:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-300 transition-colors hover:bg-zinc-800/80 hover:text-white"
          aria-expanded={mobileOpen}
          aria-controls="admin-mobile-nav"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">Orion admin</p>
          <p className="truncate text-[11px] text-zinc-500">Control center</p>
        </div>
      </header>

      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm md:hidden"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <aside
        className="relative hidden shrink-0 flex-col border-zinc-800/80 bg-zinc-950/50 backdrop-blur-xl md:flex md:w-64 md:border-r"
        aria-label="Admin navigation"
      >
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{sidebarBody}</div>
      </aside>

      <aside
        id="admin-mobile-nav"
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(20rem,100vw)] flex-col border-r border-zinc-800/80 bg-zinc-950/98 shadow-2xl shadow-black/40 backdrop-blur-xl transition-transform duration-200 ease-out md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div className="flex h-14 shrink-0 items-center justify-end border-b border-zinc-800/80 px-2">
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800/80 hover:text-white"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">{sidebarBody}</div>
      </aside>

      <main className="relative flex-1 overflow-x-hidden p-4 sm:p-6 md:p-8">{children}</main>
    </div>
  );
}
