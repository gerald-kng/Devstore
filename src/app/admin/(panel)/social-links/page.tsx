import { saveSocialLinksAction } from "@/app/admin/actions";
import { isSupabaseConfigured } from "@/lib/env";
import { getSocialLinkSettings, SOCIAL_PROFILES } from "@/lib/social";

export const dynamic = "force-dynamic";

export default async function AdminSocialLinksPage() {
  if (!isSupabaseConfigured()) {
    return <p>Supabase is not configured.</p>;
  }
  const settings = await getSocialLinkSettings();
  const iconByKey = new Map(SOCIAL_PROFILES.map((p) => [p.key, p.icon]));

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-white">Social links</h1>
      <p className="mt-1 text-sm text-zinc-500">
        These render as icons in the storefront footer. Leave a URL blank to hide a profile.
        Use full URLs (https://…) or a plain email address.
      </p>

      <form action={saveSocialLinksAction} className="mt-6 space-y-3">
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-900/50 text-xs uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-3 py-2">Profile</th>
                <th className="px-3 py-2">URL</th>
                <th className="px-3 py-2 w-20">Order</th>
                <th className="px-3 py-2 w-20">Active</th>
              </tr>
            </thead>
            <tbody>
              {settings.map((s) => {
                const Icon = iconByKey.get(s.key);
                return (
                  <tr
                    key={s.key}
                    className="border-t border-zinc-800/80 align-top"
                  >
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        {Icon ? (
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-zinc-300">
                            <Icon className="h-3.5 w-3.5" />
                          </span>
                        ) : null}
                        <div>
                          <div className="text-white">{s.label}</div>
                          <div className="font-mono text-[11px] text-zinc-500">
                            {s.key}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <input
                        name={`href__${s.key}`}
                        defaultValue={s.href}
                        placeholder={s.placeholder}
                        type={s.key === "email" ? "text" : "url"}
                        inputMode={s.key === "email" ? "email" : "url"}
                        className="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm text-white placeholder:text-zinc-600"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <input
                        name={`sort__${s.key}`}
                        type="number"
                        defaultValue={s.sort_order}
                        className="w-16 rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <label className="inline-flex items-center gap-1 text-sm">
                        <input
                          type="checkbox"
                          name={`active__${s.key}`}
                          defaultChecked={s.is_active}
                        />
                        On
                      </label>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-zinc-500">
            Tip: lower sort order shows first. Email accepts plain
            <code className="mx-1 rounded bg-zinc-900 px-1 py-0.5 text-[11px]">
              you@example.com
            </code>
            and is rendered as a <code className="rounded bg-zinc-900 px-1 py-0.5 text-[11px]">mailto:</code> link.
          </p>
          <button
            type="submit"
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-emerald-400"
          >
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}
