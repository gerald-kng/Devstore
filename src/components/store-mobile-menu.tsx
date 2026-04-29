"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

type HeaderItem = {
  slug: string;
  title: string;
  nav_label: string | null;
};

function linkClass(active: boolean): string {
  return active
    ? "block rounded-lg bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-400"
    : "block rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800/60 hover:text-emerald-400";
}

export function StoreMobileMenu({ headerItems }: { headerItems: HeaderItem[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isProducts =
    pathname === "/products" ||
    pathname?.startsWith("/products/") ||
    pathname === "/courses";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-zinc-900/70 p-2 text-zinc-200 backdrop-blur transition hover:border-emerald-500/40 hover:text-emerald-200 md:hidden"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="store-mobile-menu"
      >
        <Menu className="h-4 w-4" aria-hidden />
      </button>

      {open ? (
        <div
          id="store-mobile-menu"
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <button
            type="button"
            className="absolute inset-0 h-full w-full cursor-default bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            tabIndex={-1}
          />
          <div className="absolute right-0 top-0 flex h-full w-72 max-w-[85vw] flex-col border-l border-zinc-800 bg-zinc-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
              <span className="text-sm font-semibold text-white">Menu</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center rounded-lg border border-white/15 p-2 text-zinc-200 transition hover:border-emerald-500/40 hover:text-emerald-200"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto p-3">
              <Link href="/" className={linkClass(pathname === "/")}>
                Home
              </Link>
              <Link href="/products" className={linkClass(isProducts)}>
                Products
              </Link>
              <Link href="/courses" className={linkClass(pathname === "/courses")}>
                Courses
              </Link>
              {headerItems.map((p) => {
                const href = `/c/${p.slug}`;
                return (
                  <Link
                    key={p.slug}
                    href={href}
                    className={linkClass(pathname === href)}
                  >
                    {p.nav_label || p.title}
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-zinc-800 p-3">
              <Link
                href="/contact"
                className="block rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-center text-sm font-medium text-emerald-300 transition hover:border-emerald-400 hover:bg-emerald-500/20"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
