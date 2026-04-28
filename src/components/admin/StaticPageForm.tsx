"use client";

import { useFormState, useFormStatus } from "react-dom";
import { saveStaticPageAction } from "@/app/admin/actions";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

function Submit() {
  const s = useFormStatus();
  return (
    <button
      type="submit"
      disabled={s.pending}
      className="rounded-lg bg-emerald-500 px-3 py-2 text-sm text-zinc-950 disabled:opacity-50"
    >
      {s.pending ? "Saving…" : "Save page"}
    </button>
  );
}

type P = {
  id?: string;
  initial: {
    slug: string;
    title: string;
    body: string;
    is_published: boolean;
    nav_label: string;
    show_in_header: boolean;
    show_in_footer: boolean;
    sort_order: number;
  };
};

export function StaticPageForm({ id, initial }: P) {
  const router = useRouter();
  const [state, action] = useFormState(saveStaticPageAction, null);
  useEffect(() => {
    if (state && "ok" in state && state.ok) {
      router.refresh();
    }
  }, [state, router]);
  return (
    <form action={action} className="max-w-2xl space-y-3">
      {id ? <input type="hidden" name="id" value={id} /> : null}
      {state && "error" in state && state.error ? (
        <p className="text-sm text-red-400">{String(state.error)}</p>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs text-zinc-500">URL slug (e.g. about)</label>
          <input
            name="slug"
            defaultValue={initial.slug}
            className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm"
            required
          />
        </div>
        <div>
          <label className="text-xs text-zinc-500">Page title</label>
          <input
            name="title"
            defaultValue={initial.title}
            className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm"
            required
          />
        </div>
      </div>
      <div>
        <label className="text-xs text-zinc-500">Body (plain text; Markdown later if you add a renderer)</label>
        <textarea
          name="body"
          rows={12}
          className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm"
          defaultValue={initial.body}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs text-zinc-500">Nav label (optional, header/footer)</label>
          <input
            name="nav_label"
            defaultValue={initial.nav_label}
            className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm"
            placeholder="About"
          />
        </div>
        <div>
          <label className="text-xs text-zinc-500">Order</label>
          <input
            name="sort_order"
            type="number"
            defaultValue={initial.sort_order}
            className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input
            name="is_published"
            type="checkbox"
            defaultChecked={initial.is_published}
          />
          Published
        </label>
        <label className="flex items-center gap-2">
          <input
            name="show_in_header"
            type="checkbox"
            defaultChecked={initial.show_in_header}
          />
          Show in header
        </label>
        <label className="flex items-center gap-2">
          <input
            name="show_in_footer"
            type="checkbox"
            defaultChecked={initial.show_in_footer}
          />
          Show in footer
        </label>
      </div>
      <Submit />
    </form>
  );
}
