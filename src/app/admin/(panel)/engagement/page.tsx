import {
  deleteProductCommentAction,
  deleteProductReviewAction,
  replyProductCommentAction,
  replyProductReviewAction,
} from "@/app/admin/actions";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";

type ProductCommentRow = {
  id: string;
  email: string;
  message: string;
  admin_reply: string | null;
  created_at: string;
  products: { name: string; slug: string } | null;
};

type ProductReviewRow = {
  id: string;
  email: string;
  products: { name: string; slug: string } | null;
  rating: number;
  message: string;
  admin_reply: string | null;
  created_at: string;
};

export default async function AdminEngagementPage() {
  if (!isSupabaseConfigured()) {
    return <p>Supabase is not configured.</p>;
  }
  const db = createAdminClient();
  const [commentsRes, reviewsRes] = await Promise.all([
    db
      .from("product_comments")
      .select("id, email, message, admin_reply, created_at, products(name, slug)")
      .eq("is_deleted", false)
      .order("created_at", { ascending: false })
      .limit(100),
    db
      .from("product_reviews")
      .select("id, email, rating, message, admin_reply, created_at, products(name, slug)")
      .eq("is_deleted", false)
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  const comments = (commentsRes.data ?? []) as unknown as ProductCommentRow[];
  const reviews = (reviewsRes.data ?? []) as unknown as ProductReviewRow[];

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-2xl font-semibold text-white">Engagement</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Reply to product comments and product reviews, or delete them.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white">Product comments</h2>
        <div className="mt-4 space-y-4">
          {comments.length < 1 ? (
            <p className="text-sm text-zinc-500">No product comments yet.</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                <p className="text-xs text-zinc-500">
                  {c.email} · {c.products?.name ?? "Unknown product"}
                  {c.products?.slug ? ` (${c.products.slug})` : ""}
                </p>
                <p className="mt-2 text-sm text-zinc-300">{c.message}</p>
                <form action={replyProductCommentAction} className="mt-3 flex gap-2">
                  <input type="hidden" name="id" value={c.id} />
                  <input
                    name="admin_reply"
                    defaultValue={c.admin_reply ?? ""}
                    placeholder="Admin reply"
                    className="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm"
                  />
                  <button
                    type="submit"
                    className="rounded border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300"
                  >
                    Save reply
                  </button>
                </form>
                <form action={deleteProductCommentAction} className="mt-2">
                  <input type="hidden" name="id" value={c.id} />
                  <button type="submit" className="text-xs text-red-400 hover:underline">
                    Delete comment
                  </button>
                </form>
              </div>
            ))
          )}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white">Product reviews</h2>
        <div className="mt-4 space-y-4">
          {reviews.length < 1 ? (
            <p className="text-sm text-zinc-500">No product reviews yet.</p>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                <p className="text-xs text-zinc-500">
                  {r.email} · {r.products?.name ?? "Unknown product"}
                  {r.products?.slug ? ` (${r.products.slug})` : ""}
                </p>
                <p className="mt-1 text-sm text-amber-300">
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                </p>
                <p className="mt-2 text-sm text-zinc-300">{r.message}</p>
                <form action={replyProductReviewAction} className="mt-3 flex gap-2">
                  <input type="hidden" name="id" value={r.id} />
                  <input
                    name="admin_reply"
                    defaultValue={r.admin_reply ?? ""}
                    placeholder="Admin reply"
                    className="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm"
                  />
                  <button
                    type="submit"
                    className="rounded border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300"
                  >
                    Save reply
                  </button>
                </form>
                <form action={deleteProductReviewAction} className="mt-2">
                  <input type="hidden" name="id" value={r.id} />
                  <button type="submit" className="text-xs text-red-400 hover:underline">
                    Delete product review
                  </button>
                </form>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
