import { resendAccessLinkAction, revokeAccessAction } from "@/app/admin/actions";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  if (!isSupabaseConfigured()) {
    return <p>Supabase is not configured.</p>;
  }
  const db = createAdminClient();
  const { data, error } = await db
    .from("orders")
    .select(
      "id, customer_email, status, amount, currency, product_id, created_at, paid_at",
    )
    .order("created_at", { ascending: false })
    .limit(100);
  const orderIds = (data ?? []).map((o) => o.id);
  const { data: accessRows } =
    orderIds.length > 0
      ? await db
          .from("order_access_tokens")
          .select("order_id, revoked_at")
          .in("order_id", orderIds)
      : { data: [] as { order_id: string; revoked_at: string | null }[] };
  const accessMap = new Map(
    (accessRows ?? []).map((r) => [r.order_id, { revoked_at: r.revoked_at }]),
  );
  if (error) {
    return <p className="text-red-400">{error.message}</p>;
  }
  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Recent orders</h1>
      <p className="mt-1 text-sm text-zinc-500">Last 100 · read-only</p>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm text-zinc-300">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-500">
              <th className="py-2 pr-2">Status</th>
              <th className="pr-2">Email</th>
              <th className="pr-2">Total</th>
              <th className="pr-2">Product id</th>
              <th className="pr-2">Created</th>
              <th className="pr-2">Access</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((o) => (
              <tr key={o.id} className="border-b border-zinc-800/60">
                <td className="py-2 pr-2 text-white">{o.status}</td>
                <td className="pr-2">{o.customer_email}</td>
                <td className="pr-2">
                  {o.amount} {o.currency}
                </td>
                <td className="pr-2 font-mono text-xs text-zinc-500">{o.product_id}</td>
                <td className="text-zinc-500">
                  {new Date(o.created_at).toLocaleString()}
                </td>
                <td className="py-2">
                  {o.status === "paid" ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <form action={resendAccessLinkAction}>
                        <input type="hidden" name="order_id" value={o.id} />
                        <button
                          type="submit"
                          className="rounded border border-emerald-700/60 px-2 py-1 text-xs text-emerald-300 hover:bg-emerald-900/20"
                        >
                          Resend link
                        </button>
                      </form>
                      <form action={revokeAccessAction}>
                        <input type="hidden" name="order_id" value={o.id} />
                        <button
                          type="submit"
                          className="rounded border border-amber-700/60 px-2 py-1 text-xs text-amber-300 hover:bg-amber-900/20"
                        >
                          {accessMap.get(o.id)?.revoked_at ? "Revoked" : "Revoke"}
                        </button>
                      </form>
                    </div>
                  ) : (
                    <span className="text-xs text-zinc-600">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
