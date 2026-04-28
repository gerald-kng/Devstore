import Link from "next/link";
import { Boxes } from "lucide-react";
import { NewsletterForm } from "@/components/newsletter-form";
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
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="mb-0 flex items-center justify-between gap-3 border-b border-zinc-800/80 py-3 text-xs text-zinc-500">
          <Link href="/" className="inline-flex items-center gap-2 text-zinc-200 hover:text-white">
            <Boxes className="h-5 w-5 text-emerald-400" aria-hidden />
            <span className="text-sm font-semibold tracking-tight">Orion Dev Store</span>
          </Link>
          <nav className="flex flex-wrap items-center justify-center gap-3">
            <StoreNavLinks headerItems={header} />
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/contact"
              className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 transition hover:border-emerald-400 hover:bg-emerald-500/20"
            >
              Contact
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
      {children}
      {showFooter ? (
        <footer className="mx-auto mt-auto w-full max-w-6xl px-6">
          <div className="mt-10 grid gap-6 border-t border-zinc-800/80 py-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm font-semibold text-white">Orion Dev Store</p>
              <p className="mt-2 text-xs text-zinc-500">
                Digital products, secure checkout, and instant delivery access.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Explore</p>
              <div className="mt-2 space-y-1 text-xs">
                <Link href="/" className="block text-zinc-500 hover:text-emerald-400">
                  Home
                </Link>
                <Link href="/products" className="block text-zinc-500 hover:text-emerald-400">
                  Products
                </Link>
                <Link href="/courses" className="block text-zinc-500 hover:text-emerald-400">
                  Courses
                </Link>
                <Link href="/contact" className="block text-zinc-500 hover:text-emerald-400">
                  Contact
                </Link>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Legal</p>
              <div className="mt-2 space-y-1 text-xs">
                <Link href="/terms" className="block text-zinc-500 hover:text-emerald-400">
                  Terms of Use
                </Link>
                <Link href="/privacy" className="block text-zinc-500 hover:text-emerald-400">
                  Privacy Policy
                </Link>
                {footer.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/c/${p.slug}`}
                    className="block text-zinc-500 hover:text-emerald-400"
                  >
                    {p.nav_label || p.title}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Newsletter</p>
              <p className="mt-2 text-xs text-zinc-500">
                Get updates on new releases and offers.
              </p>
              <div className="mt-3">
                <NewsletterForm />
              </div>
            </div>
          </div>
        </footer>
      ) : null}
    </div>
  );
}
