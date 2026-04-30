import Link from "next/link";
import { Boxes } from "lucide-react";
import { NewsletterForm } from "@/components/newsletter-form";
import { SocialLinks } from "@/components/social-links";
import { StoreMobileMenu } from "@/components/store-mobile-menu";
import { StoreNavLinks } from "@/components/store-nav-links";
import { ThemeToggle } from "@/components/theme-toggle";
import { getFooterNavLinks, getHeaderNavLinks } from "@/lib/site";
import { isSupabaseConfigured } from "@/lib/env";

export async function StoreChrome({
  children,
  showFooter = true,
}: {
  children: React.ReactNode;
  showFooter?: boolean;
}) {
  if (!isSupabaseConfigured()) {
    return <div className="flex min-h-full flex-1 flex-col">{children}</div>;
  }
  const [header, footer] = await Promise.all([
    getHeaderNavLinks(),
    showFooter ? getFooterNavLinks() : Promise.resolve([]),
  ]);
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <div className="sticky top-0 z-30 border-b border-zinc-800/70 bg-zinc-950/70 backdrop-blur-md supports-[backdrop-filter]:bg-zinc-950/55">
        <div className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="flex items-center justify-between gap-3 py-3 text-xs text-zinc-500">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-zinc-200 transition hover:text-white"
              aria-label="Orion Dev Store home"
            >
              <span className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 transition duration-300 group-hover:border-emerald-400/60 group-hover:bg-emerald-500/20">
                <Boxes className="h-4 w-4" aria-hidden />
                <span className="pointer-events-none absolute inset-0 rounded-lg bg-emerald-500/20 opacity-0 blur transition duration-500 group-hover:opacity-100" />
              </span>
              <span className="hidden text-sm font-semibold tracking-tight text-white sm:inline">
                Orion <span className="text-emerald-300">Dev</span>
              </span>
            </Link>
            <nav className="hidden flex-wrap items-center justify-center gap-4 md:flex">
              <StoreNavLinks headerItems={header} />
            </nav>
            <div className="flex items-center gap-2">
              <Link
                href="/contact"
                className="hidden rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 transition hover:border-emerald-400 hover:bg-emerald-500/20 sm:inline-flex"
              >
                Contact
              </Link>
              <ThemeToggle />
              <StoreMobileMenu headerItems={header} />
            </div>
          </div>
        </div>
      </div>
      {children}
      {showFooter ? (
        <footer className="relative mt-auto overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/25 to-transparent hero-glow-breathe" />
          <div className="pointer-events-none absolute -left-32 -top-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-[110px] hero-orb hero-orb-a" />
          <div className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-[110px] hero-orb hero-orb-b" />
          <div className="mx-auto w-full max-w-6xl px-6">
            <div className="mt-12 grid gap-8 border-t border-zinc-800/70 py-12 sm:grid-cols-2 lg:grid-cols-4">
              <div className="reveal">
                <Link
                  href="/"
                  className="group inline-flex items-center gap-2 text-white"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 transition group-hover:border-emerald-400/60 ambient-float">
                    <Boxes className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="text-sm font-semibold tracking-tight">
                    Orion Dev Store
                  </span>
                </Link>
                <p className="mt-3 text-xs leading-relaxed text-zinc-500">
                  Digital products, secure checkout, and instant delivery access.
                </p>
                <SocialLinks className="mt-4" />
              </div>
              <div
                className="reveal"
                style={{ transitionDelay: "80ms" }}
              >
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-300/80">
                  Explore
                </p>
                <div className="mt-3 flex flex-col items-start gap-1.5 text-xs">
                  <Link
                    href="/"
                    className="link-underline text-zinc-400 hover:text-emerald-300"
                  >
                    Home
                  </Link>
                  <Link
                    href="/products"
                    className="link-underline text-zinc-400 hover:text-emerald-300"
                  >
                    Products
                  </Link>
                  <Link
                    href="/courses"
                    className="link-underline text-zinc-400 hover:text-emerald-300"
                  >
                    Courses
                  </Link>
                  <Link
                    href="/hire"
                    className="link-underline text-zinc-400 hover:text-emerald-300"
                  >
                    Hire a developer
                  </Link>
                  <Link
                    href="/about"
                    className="link-underline text-zinc-400 hover:text-emerald-300"
                  >
                    About
                  </Link>
                  <Link
                    href="/contact"
                    className="link-underline text-zinc-400 hover:text-emerald-300"
                  >
                    Contact
                  </Link>
                </div>
              </div>
              <div
                className="reveal"
                style={{ transitionDelay: "160ms" }}
              >
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-300/80">
                  Legal
                </p>
                <div className="mt-3 flex flex-col items-start gap-1.5 text-xs">
                  <Link
                    href="/terms"
                    className="link-underline text-zinc-400 hover:text-emerald-300"
                  >
                    Terms of Use
                  </Link>
                  <Link
                    href="/privacy"
                    className="link-underline text-zinc-400 hover:text-emerald-300"
                  >
                    Privacy Policy
                  </Link>
                  {footer.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/c/${p.slug}`}
                      className="link-underline text-zinc-400 hover:text-emerald-300"
                    >
                      {p.nav_label || p.title}
                    </Link>
                  ))}
                </div>
              </div>
              <div
                className="reveal"
                style={{ transitionDelay: "240ms" }}
              >
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-300/80">
                  Newsletter
                </p>
                <p className="mt-3 text-xs text-zinc-500">
                  Get updates on new releases and offers.
                </p>
                <div className="mt-3">
                  <NewsletterForm />
                </div>
              </div>
            </div>
            <div className="border-t border-zinc-800/70 py-5 text-center text-[11px] text-zinc-600 sm:text-left">
              © {new Date().getFullYear()} Orion Dev Store. Crafted for builders.
            </div>
          </div>
        </footer>
      ) : null}
    </div>
  );
}
