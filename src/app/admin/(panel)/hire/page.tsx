import {
  deleteHireRequestAction,
  updateHireRequestAction,
} from "@/app/admin/actions";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/env";
import {
  BUDGET_RANGES,
  CONTACT_METHODS,
  PROJECT_TYPES,
  TIMELINES,
  labelFor,
} from "@/lib/hire-options";

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  name: string;
  email: string;
  company: string;
  project_type: string;
  description: string;
  goals: string;
  tech_stack: string;
  budget_range: string;
  timeline: string;
  start_date: string;
  reference_links: string;
  nda_required: boolean;
  contact_method: string;
  is_handled: boolean;
  admin_notes: string;
  created_at: string;
};

export default async function AdminHirePage() {
  if (!isSupabaseConfigured()) {
    return <p>Supabase is not configured.</p>;
  }
  const db = createAdminClient();
  const { data, error } = await db
    .from("hire_requests")
    .select(
      "id, name, email, company, project_type, description, goals, tech_stack, budget_range, timeline, start_date, reference_links, nda_required, contact_method, is_handled, admin_notes, created_at",
    )
    .order("is_handled", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    return (
      <p className="text-red-400">
        Could not load hire requests. Did you run migration{" "}
        <code>011_hire_requests.sql</code>? {error.message}
      </p>
    );
  }

  const rows = (data ?? []) as Row[];
  const open = rows.filter((r) => !r.is_handled);
  const handled = rows.filter((r) => r.is_handled);

  return (
    <div className="space-y-10">
      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-white">Hire requests</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Project enquiries submitted from <code>/hire</code>. Mark as
              handled once you&apos;ve replied.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-300">
              {open.length} open
            </span>
            <span className="rounded-full border border-zinc-700 px-3 py-1">
              {handled.length} handled
            </span>
          </div>
        </div>
      </section>

      <Section title="Open" rows={open} emptyLabel="No open requests right now." />

      {handled.length > 0 ? (
        <Section title="Handled" rows={handled} emptyLabel="" muted />
      ) : null}
    </div>
  );
}

function Section({
  title,
  rows,
  emptyLabel,
  muted = false,
}: {
  title: string;
  rows: Row[];
  emptyLabel: string;
  muted?: boolean;
}) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <div className="mt-4 space-y-4">
        {rows.length < 1 ? (
          <p className="text-sm text-zinc-500">{emptyLabel}</p>
        ) : (
          rows.map((r) => (
            <RequestCard key={r.id} row={r} muted={muted} />
          ))
        )}
      </div>
    </section>
  );
}

function RequestCard({ row, muted }: { row: Row; muted: boolean }) {
  const created = new Date(row.created_at).toLocaleString();
  return (
    <article
      className={`rounded-xl border p-5 ${
        muted
          ? "border-zinc-800/70 bg-zinc-900/20 text-zinc-400"
          : "border-zinc-800 bg-zinc-900/40 text-zinc-300"
      }`}
    >
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-white">
            {row.name?.length ? row.name : row.email}
            {row.company ? (
              <span className="text-zinc-500"> · {row.company}</span>
            ) : null}
          </p>
          <p className="text-xs text-zinc-500">
            {row.email} · {created}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-[11px]">
          <Pill>{labelFor(PROJECT_TYPES, row.project_type)}</Pill>
          <Pill tone="emerald">{labelFor(BUDGET_RANGES, row.budget_range)}</Pill>
          <Pill tone="cyan">{labelFor(TIMELINES, row.timeline)}</Pill>
          <Pill>
            via {labelFor(CONTACT_METHODS, row.contact_method)}
          </Pill>
          {row.nda_required ? <Pill tone="amber">NDA</Pill> : null}
          {row.start_date ? <Pill>start {row.start_date}</Pill> : null}
        </div>
      </header>

      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
        {row.description}
      </p>

      <dl className="mt-4 grid gap-3 text-xs sm:grid-cols-2">
        {row.goals ? (
          <Detail label="Success looks like" value={row.goals} />
        ) : null}
        {row.tech_stack ? (
          <Detail label="Preferred stack" value={row.tech_stack} />
        ) : null}
        {row.reference_links ? (
          <Detail label="Reference links" value={row.reference_links} mono />
        ) : null}
      </dl>

      <form action={updateHireRequestAction} className="mt-4 space-y-2">
        <input type="hidden" name="id" value={row.id} />
        <textarea
          name="admin_notes"
          defaultValue={row.admin_notes}
          rows={2}
          placeholder="Internal notes (only visible here)"
          className="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-xs text-zinc-200"
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="inline-flex items-center gap-2 text-xs text-zinc-400">
            <input
              type="checkbox"
              name="is_handled"
              defaultChecked={row.is_handled}
              className="h-3.5 w-3.5 accent-emerald-500"
            />
            Mark as handled
          </label>
          <button
            type="submit"
            className="rounded border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 hover:border-emerald-400 hover:bg-emerald-500/20"
          >
            Save
          </button>
        </div>
      </form>

      <form action={deleteHireRequestAction} className="mt-2">
        <input type="hidden" name="id" value={row.id} />
        <button
          type="submit"
          className="text-[11px] text-red-400 hover:underline"
        >
          Delete request
        </button>
      </form>
    </article>
  );
}

function Pill({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone?: "emerald" | "cyan" | "amber";
}) {
  const toneClass =
    tone === "emerald"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
      : tone === "cyan"
        ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
        : tone === "amber"
          ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
          : "border-zinc-700 bg-zinc-900/60 text-zinc-300";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 ${toneClass}`}
    >
      {children}
    </span>
  );
}

function Detail({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </dt>
      <dd
        className={`mt-1 whitespace-pre-wrap text-zinc-300 ${
          mono ? "font-mono text-[11px] break-all" : ""
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
