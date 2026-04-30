import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";
import { CtaBanner } from "@/components/cta-banner";
import { PageBackdrop } from "@/components/page-backdrop";
import { StoreChrome } from "@/components/store-chrome";
import { getCmsPageBySlug } from "@/lib/site";
import { isSupabaseConfigured } from "@/lib/env";
import { buildMetadata } from "@/lib/seo";

type P = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "about") {
    return buildMetadata({
      title: "About",
      path: "/about",
    });
  }
  if (!isSupabaseConfigured()) {
    return buildMetadata({ title: "Page", path: `/c/${slug}`, noindex: true });
  }
  const page = await getCmsPageBySlug(slug);
  if (!page) {
    return buildMetadata({
      title: "Page not found",
      path: `/c/${slug}`,
      noindex: true,
    });
  }
  const excerpt = page.body.replace(/\s+/g, " ").trim().slice(0, 160);
  return buildMetadata({
    title: page.title,
    description: excerpt || `Read ${page.title} from Orion Dev Store.`,
    path: `/c/${slug}`,
    ogType: "article",
  });
}

export default async function CmsPage({ params }: P) {
  const { slug } = await params;
  // /c/about is the historical CMS slug; the dedicated /about route is now canonical.
  if (slug === "about") {
    redirect("/about");
  }
  if (!isSupabaseConfigured()) {
    notFound();
  }
  const page = await getCmsPageBySlug(slug);
  if (!page) {
    notFound();
  }
  return (
    <StoreChrome>
      <div className="relative isolate flex min-h-full flex-1 flex-col overflow-hidden bg-zinc-950 text-zinc-100">
        <PageBackdrop variant="subtle" />

        <main className="relative z-10 mx-auto w-full max-w-3xl flex-1 px-6 pt-16 pb-20 sm:pt-20">
          <Link
            href="/"
            className="link-underline text-sm text-emerald-300 hover:text-emerald-200"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            Home
          </Link>

          <div
            className="hero-rise mt-8 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/[0.08] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-300 backdrop-blur"
            style={{ animationDelay: "0ms" }}
          >
            <BookOpen className="h-3.5 w-3.5" aria-hidden />
            From the store
          </div>

          <h1
            className="hero-rise mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl"
            style={{ animationDelay: "120ms" }}
          >
            {page.title}
          </h1>

          <article className="reveal mt-10 glass-card p-6 sm:p-8">
            <div className="prose prose-invert max-w-none whitespace-pre-wrap text-zinc-300">
              {page.body}
            </div>
          </article>

          <CtaBanner className="mt-20" />
        </main>
      </div>
    </StoreChrome>
  );
}
