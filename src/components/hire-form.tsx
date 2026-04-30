"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Send, Sparkles } from "lucide-react";
import {
  BUDGET_RANGES,
  CONTACT_METHODS,
  PROJECT_TYPES,
  TIMELINES,
} from "@/lib/hire-options";

type State = "idle" | "submitting" | "success" | "error";

const initial = {
  name: "",
  email: "",
  company: "",
  project_type: "webapp",
  description: "",
  goals: "",
  tech_stack: "",
  budget_range: "discuss",
  timeline: "flexible",
  start_date: "",
  reference_links: "",
  nda_required: false,
  contact_method: "email",
};

const inputClass =
  "w-full rounded-lg border border-zinc-700 bg-zinc-900/80 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-400/60 focus:outline-none focus:ring-1 focus:ring-emerald-400/30";
const labelClass = "block text-xs font-medium uppercase tracking-[0.18em] text-zinc-500";

export function HireForm() {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof typeof initial>(
    key: K,
    value: (typeof initial)[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/hire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        throw new Error(json.error ?? "Could not submit your request.");
      }
      setStatus("success");
      setForm(initial);
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error ? err.message : "Could not submit your request.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="reveal rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 text-center">
        <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/15 text-emerald-300">
          <CheckCircle2 className="h-6 w-6" aria-hidden />
        </span>
        <h2 className="mt-4 text-lg font-semibold text-white">
          Request received
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-zinc-400">
          Thanks for the details. We&apos;ll review your project and get back to
          you within one business day with next steps.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 inline-flex items-center gap-1 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300 transition hover:border-emerald-400 hover:bg-emerald-500/20"
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur"
    >
      <Section
        eyebrow="Step 1"
        title="About you"
        description="So we know who's reaching out and where to reply."
      >
        <Field label="Your name" htmlFor="name" hint="Optional, but helpful.">
          <input
            id="name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Jane Doe"
            className={inputClass}
            maxLength={200}
          />
        </Field>
        <Field label="Email" htmlFor="email" required>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@company.com"
            className={inputClass}
          />
        </Field>
        <Field
          label="Company / Organization"
          htmlFor="company"
          hint="Optional. Helps us tailor the proposal."
        >
          <input
            id="company"
            value={form.company}
            onChange={(e) => update("company", e.target.value)}
            placeholder="Acme Inc."
            className={inputClass}
            maxLength={200}
          />
        </Field>
        <Field
          label="Preferred contact method"
          htmlFor="contact_method"
        >
          <select
            id="contact_method"
            value={form.contact_method}
            onChange={(e) => update("contact_method", e.target.value)}
            className={inputClass}
          >
            {CONTACT_METHODS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
      </Section>

      <Divider />

      <Section
        eyebrow="Step 2"
        title="The project"
        description="The more detail you share, the more accurate our scope and quote will be."
      >
        <Field label="Project type" htmlFor="project_type" required>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {PROJECT_TYPES.map((o) => {
              const active = form.project_type === o.value;
              return (
                <button
                  type="button"
                  key={o.value}
                  onClick={() => update("project_type", o.value)}
                  className={`rounded-lg border px-3 py-2 text-left text-xs transition ${
                    active
                      ? "border-emerald-400/60 bg-emerald-500/10 text-emerald-200"
                      : "border-zinc-700 bg-zinc-900/50 text-zinc-300 hover:border-emerald-500/40 hover:text-emerald-200"
                  }`}
                  aria-pressed={active}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        </Field>

        <Field
          label="Describe what you want built"
          htmlFor="description"
          required
          hint="At least 30 characters. Include features, users, and any must-haves."
        >
          <textarea
            id="description"
            required
            minLength={30}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={6}
            placeholder="e.g. A subscription-based dashboard for Shopify store owners that surfaces low-stock alerts and suggested re-orders…"
            className={inputClass}
            maxLength={8000}
          />
          <p className="mt-1 text-right text-[11px] text-zinc-600">
            {form.description.length} / 8000
          </p>
        </Field>

        <Field
          label="What does success look like?"
          htmlFor="goals"
          hint="Outcomes, KPIs, or the milestone you want to hit."
        >
          <textarea
            id="goals"
            value={form.goals}
            onChange={(e) => update("goals", e.target.value)}
            rows={3}
            placeholder="e.g. Launch a public beta with 50 paying users in 60 days."
            className={inputClass}
            maxLength={4000}
          />
        </Field>

        <Field
          label="Preferred tech / stack"
          htmlFor="tech_stack"
          hint="Optional. Leave blank if you'd like us to recommend."
        >
          <input
            id="tech_stack"
            value={form.tech_stack}
            onChange={(e) => update("tech_stack", e.target.value)}
            placeholder="e.g. Next.js + Supabase, React Native, n8n + Postgres"
            className={inputClass}
            maxLength={1000}
          />
        </Field>

        <Field
          label="Reference links"
          htmlFor="reference_links"
          hint="Existing site, competitors, design files, similar tools…"
        >
          <textarea
            id="reference_links"
            value={form.reference_links}
            onChange={(e) => update("reference_links", e.target.value)}
            rows={3}
            placeholder={"https://example.com\nhttps://figma.com/file/…"}
            className={inputClass}
            maxLength={2000}
          />
        </Field>
      </Section>

      <Divider />

      <Section
        eyebrow="Step 3"
        title="Budget & timing"
        description="Honest ranges help us match the right scope."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Budget range" htmlFor="budget_range" required>
            <select
              id="budget_range"
              value={form.budget_range}
              onChange={(e) => update("budget_range", e.target.value)}
              className={inputClass}
            >
              {BUDGET_RANGES.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Timeline" htmlFor="timeline" required>
            <select
              id="timeline"
              value={form.timeline}
              onChange={(e) => update("timeline", e.target.value)}
              className={inputClass}
            >
              {TIMELINES.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field
          label="Ideal start date"
          htmlFor="start_date"
          hint="Optional. Approximate is fine."
        >
          <input
            id="start_date"
            type="date"
            value={form.start_date}
            onChange={(e) => update("start_date", e.target.value)}
            className={inputClass}
          />
        </Field>
        <label className="mt-2 flex items-start gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 text-sm text-zinc-300 transition hover:border-emerald-500/30">
          <input
            type="checkbox"
            checked={form.nda_required}
            onChange={(e) => update("nda_required", e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-emerald-500"
          />
          <span>
            <span className="font-medium text-white">NDA required</span>
            <span className="block text-xs text-zinc-500">
              Tick if we should sign a mutual NDA before reviewing details.
            </span>
          </span>
        </label>
      </Section>

      {status === "error" && error ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col items-stretch gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-xs text-zinc-500">
          <Sparkles className="h-3.5 w-3.5 text-emerald-300" aria-hidden />
          Replies usually within one business day.
        </p>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-5 py-2.5 text-sm font-semibold text-emerald-200 transition hover:border-emerald-400 hover:bg-emerald-500/20 disabled:cursor-progress disabled:opacity-60"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-emerald-500/0 via-emerald-300/30 to-emerald-500/0 transition-transform duration-700 ease-out group-hover:translate-x-full"
          />
          {status === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Sending…
            </>
          ) : (
            <>
              <Send className="h-4 w-4" aria-hidden />
              Send project request
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function Section({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-300/80">
          {eyebrow}
        </p>
        <h3 className="mt-1 text-base font-semibold text-white">{title}</h3>
        <p className="mt-1 text-xs text-zinc-500">{description}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
        {required ? <span className="ml-1 text-emerald-300">*</span> : null}
      </label>
      <div className="mt-1.5">{children}</div>
      {hint ? <p className="mt-1 text-[11px] text-zinc-600">{hint}</p> : null}
    </div>
  );
}

function Divider() {
  return (
    <div className="section-hairline my-2 opacity-70" aria-hidden />
  );
}
