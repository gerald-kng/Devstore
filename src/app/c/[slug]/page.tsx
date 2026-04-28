import Link from "next/link";
import { notFound } from "next/navigation";
import { StoreChrome } from "@/components/store-chrome";
import { getCmsPageBySlug } from "@/lib/site";
import { isSupabaseConfigured } from "@/lib/env";

type P = { params: Promise<{ slug: string }> };

export default async function CmsPage({ params }: P) {
  const { slug } = await params;
  if (!isSupabaseConfigured()) {
    notFound();
  }
  const page = await getCmsPageBySlug(slug);
  if (!page) {
    notFound();
  }
  return (
    <StoreChrome>
    <div className="mx-auto flex min-h-full max-w-2xl flex-1 flex-col bg-zinc-950 px-6 py-16 text-zinc-100">
      <Link
        href="/"
        className="text-sm text-emerald-500 hover:text-emerald-300"
      >
        ← Home
      </Link>
      <h1 className="mt-6 text-3xl font-semibold text-white">{page.title}</h1>
      <div className="prose prose-invert mt-8 max-w-none whitespace-pre-wrap text-zinc-300">
        {page.body}
      </div>
    </div>
    </StoreChrome>
  );
}
