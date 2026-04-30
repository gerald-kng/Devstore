"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes, ChevronRight, Menu, X } from "lucide-react";

type HeaderItem = {
  slug: string;
  title: string;
  nav_label: string | null;
};

type NavItem = {
  href: string;
  label: string;
  active: boolean;
};

const TRANSITION_MS = 320;

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function StoreMobileMenu({ headerItems }: { headerItems: HeaderItem[] }) {
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);
  const [hasDocument, setHasDocument] = useState(false);
  const closeTimerRef = useRef<number | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setHasDocument(true);
  }, []);

  const closeMenu = useCallback(() => {
    if (closeTimerRef.current) return;
    setShow(false);
    closeTimerRef.current = window.setTimeout(() => {
      setMounted(false);
      closeTimerRef.current = null;
    }, TRANSITION_MS);
  }, []);

  const openMenu = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setMounted(true);
    // Two RAFs let the drawer mount in its closed state before we flip to open,
    // so the CSS transition actually plays on first render.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setShow(true));
    });
  }, []);

  // Close on route change.
  useEffect(() => {
    if (!mounted) return;
    closeMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Body scroll lock while open.
  useEffect(() => {
    if (!mounted) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [mounted]);

  // ESC to close.
  useEffect(() => {
    if (!mounted) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeMenu();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mounted, closeMenu]);

  useEffect(
    () => () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    },
    [],
  );

  const isProductsRoute =
    pathname === "/products" || pathname?.startsWith("/products/");

  const navItems: NavItem[] = [
    { href: "/", label: "Home", active: pathname === "/" },
    { href: "/products", label: "Products", active: isProductsRoute },
    { href: "/courses", label: "Courses", active: pathname === "/courses" },
    { href: "/hire", label: "Hire a developer", active: pathname === "/hire" },
    { href: "/about", label: "About", active: pathname === "/about" },
    ...headerItems.map((p) => ({
      href: `/c/${p.slug}`,
      label: p.nav_label || p.title,
      active: pathname === `/c/${p.slug}`,
    })),
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => (mounted ? closeMenu() : openMenu())}
        className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-white/15 bg-zinc-900/70 text-zinc-200 backdrop-blur transition duration-300 hover:border-emerald-400/50 hover:bg-emerald-500/10 hover:text-emerald-200 md:hidden"
        aria-label={show ? "Close menu" : "Open menu"}
        aria-expanded={show}
        aria-controls="store-mobile-menu"
      >
        <span className="relative inline-block h-4 w-4">
          <Menu
            className={cn(
              "absolute inset-0 h-4 w-4 transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
              show
                ? "rotate-90 scale-75 opacity-0"
                : "rotate-0 scale-100 opacity-100",
            )}
            aria-hidden
          />
          <X
            className={cn(
              "absolute inset-0 h-4 w-4 transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
              show
                ? "rotate-0 scale-100 opacity-100"
                : "-rotate-90 scale-75 opacity-0",
            )}
            aria-hidden
          />
        </span>
      </button>

      {mounted && hasDocument
        ? createPortal(
            <MobileMenuOverlay
              show={show}
              navItems={navItems}
              closeMenu={closeMenu}
            />,
            document.body,
          )
        : null}
    </>
  );
}

function MobileMenuOverlay({
  show,
  navItems,
  closeMenu,
}: {
  show: boolean;
  navItems: NavItem[];
  closeMenu: () => void;
}) {
  return (
    <div
      id="store-mobile-menu"
      className="fixed inset-0 z-[100] md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
    >
          <button
            type="button"
            onClick={closeMenu}
            tabIndex={-1}
            aria-label="Close menu"
            className={cn(
              "absolute inset-0 h-full w-full cursor-default bg-black/70 backdrop-blur-sm transition-opacity duration-300 ease-out motion-reduce:transition-none",
              show ? "opacity-100" : "opacity-0",
            )}
          />

          <div
            className={cn(
              "absolute right-0 top-0 flex h-full w-80 max-w-[88vw] flex-col overflow-hidden",
              "border-l border-white/10 bg-zinc-950/95 shadow-[-30px_0_60px_-15px_rgba(0,0,0,0.6)] backdrop-blur-xl",
              "transition-[transform,opacity] duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
              show
                ? "translate-x-0 opacity-100"
                : "translate-x-full opacity-0",
            )}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
            <div className="pointer-events-none absolute -left-16 -top-24 h-56 w-56 rounded-full bg-emerald-500/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-10 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />

            <div className="relative flex items-center justify-between border-b border-zinc-800/70 px-4 py-3">
              <Link
                href="/"
                onClick={closeMenu}
                className="group inline-flex items-center gap-2 text-zinc-200 transition hover:text-white"
              >
                <span className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 transition duration-300 group-hover:border-emerald-400/60 group-hover:bg-emerald-500/20">
                  <Boxes className="h-4 w-4" aria-hidden />
                </span>
                <span className="text-sm font-semibold tracking-tight text-white">
                  Orion <span className="text-emerald-300">Dev</span>
                </span>
              </Link>
              <button
                type="button"
                onClick={closeMenu}
                aria-label="Close menu"
                className="group inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-zinc-300 transition duration-300 hover:rotate-90 hover:border-emerald-400/50 hover:text-emerald-200"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>

            <nav className="relative flex-1 space-y-1 overflow-y-auto p-3">
              {navItems.map((item, i) => (
                <div
                  key={item.href}
                  style={{
                    transitionDelay: show ? `${80 + i * 45}ms` : "0ms",
                  }}
                  className={cn(
                    "transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none",
                    show
                      ? "translate-x-0 opacity-100"
                      : "translate-x-4 opacity-0",
                  )}
                >
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className={cn(
                      "group relative flex items-center gap-2 overflow-hidden rounded-lg px-3 py-2 text-sm font-medium transition duration-300",
                      item.active
                        ? "bg-emerald-500/10 text-emerald-300"
                        : "text-zinc-300 hover:bg-zinc-800/60 hover:text-emerald-200",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute left-0 top-1/2 h-5 -translate-y-1/2 rounded-r bg-gradient-to-b from-emerald-400 to-cyan-400 transition-[width,opacity] duration-300",
                        item.active
                          ? "w-[3px] opacity-100"
                          : "w-0 opacity-0 group-hover:w-[2px] group-hover:opacity-70",
                      )}
                      aria-hidden
                    />
                    <span className="relative flex-1">{item.label}</span>
                    <ChevronRight
                      className={cn(
                        "h-3.5 w-3.5 transition-all duration-300",
                        item.active
                          ? "translate-x-0 text-emerald-300 opacity-100"
                          : "-translate-x-1 text-zinc-500 opacity-0 group-hover:translate-x-0 group-hover:text-emerald-300 group-hover:opacity-100",
                      )}
                      aria-hidden
                    />
                  </Link>
                </div>
              ))}
            </nav>

            <div
              style={{
                transitionDelay: show
                  ? `${80 + navItems.length * 45 + 60}ms`
                  : "0ms",
              }}
              className={cn(
                "relative border-t border-zinc-800/70 p-3",
                "transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none",
                show
                  ? "translate-y-0 opacity-100"
                  : "translate-y-2 opacity-0",
              )}
            >
              <Link
                href="/contact"
                onClick={closeMenu}
                className="group relative block overflow-hidden rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-center text-sm font-medium text-emerald-300 transition duration-300 hover:border-emerald-400 hover:bg-emerald-500/20"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-emerald-500/0 via-emerald-300/30 to-emerald-500/0 transition-transform duration-700 ease-out group-hover:translate-x-full"
                />
                <span className="relative">Contact</span>
              </Link>
              <p className="mt-3 text-center text-[10px] uppercase tracking-[0.22em] text-zinc-600">
                Orion Dev Store
              </p>
            </div>
          </div>
        </div>
  );
}
