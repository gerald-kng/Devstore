import Link from "next/link";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  if (!isSupabaseConfigured()) {
    return <p>Supabase is not configured.</p>;
  }
  const db = createAdminClient();
  const { data, error } = await db
    .from("products")
    .select("id, name, slug, price_amount, price_currency, is_active, sort_order")
    .order("sort_order", { ascending: true });
  if (error) {
    return <p className="text-red-400">{error.message}</p>;
  }
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-emerald-500 px-3 py-1.5 text-sm font-medium text-zinc-950"
        >
          New product
        </Link>
      </div>
      <ul className="mt-6 divide-y divide-zinc-800">
        {(data ?? []).map((p) => (
          <li
            key={p.id}
            className="flex items-center justify-between py-3 text-sm text-zinc-300"
          >
            <div>
              <span className="font-medium text-white">{p.name}</span>{" "}
              <span className="text-zinc-500">{p.slug}</span>{" "}
              {!p.is_active ? (
                <span className="text-amber-400">(hidden)</span>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-500">
                {p.price_amount} {p.price_currency}
              </span>
              <Link
                className="text-emerald-400 hover:underline"
                href={`/admin/products/${p.id}/edit`}
              >
                Edit
              </Link>
              <DeleteProductButton productId={p.id} productName={p.name} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
