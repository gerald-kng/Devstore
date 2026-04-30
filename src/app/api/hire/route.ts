import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/env";
import {
  BUDGET_RANGE_VALUES,
  CONTACT_METHOD_VALUES,
  PROJECT_TYPE_VALUES,
  TIMELINE_VALUES,
} from "@/lib/hire-options";

const MAX_DESCRIPTION = 8000;
const MAX_FIELD = 1000;
const MAX_REFERENCES = 2000;

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function clean(value: unknown, max = MAX_FIELD): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Hire form is temporarily unavailable." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const r = (body ?? {}) as Record<string, unknown>;

  const email = clean(r.email, 320).toLowerCase();
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const description = clean(r.description, MAX_DESCRIPTION);
  if (description.length < 30) {
    return NextResponse.json(
      { error: "Project description must be at least 30 characters." },
      { status: 400 },
    );
  }

  const projectTypeRaw = clean(r.project_type, 64) || "other";
  const project_type = PROJECT_TYPE_VALUES.has(projectTypeRaw)
    ? projectTypeRaw
    : "other";

  const budgetRaw = clean(r.budget_range, 32) || "discuss";
  const budget_range = BUDGET_RANGE_VALUES.has(budgetRaw) ? budgetRaw : "discuss";

  const timelineRaw = clean(r.timeline, 32) || "flexible";
  const timeline = TIMELINE_VALUES.has(timelineRaw) ? timelineRaw : "flexible";

  const contactMethodRaw = clean(r.contact_method, 32) || "email";
  const contact_method = CONTACT_METHOD_VALUES.has(contactMethodRaw)
    ? contactMethodRaw
    : "email";

  const insert = {
    email,
    name: clean(r.name, 200),
    company: clean(r.company, 200),
    project_type,
    description,
    goals: clean(r.goals, 4000),
    tech_stack: clean(r.tech_stack, 1000),
    budget_range,
    timeline,
    start_date: clean(r.start_date, 64),
    reference_links: clean(r.reference_links, MAX_REFERENCES),
    nda_required: Boolean(r.nda_required),
    contact_method,
  };

  const db = createAdminClient();
  const { error } = await db.from("hire_requests").insert(insert);
  if (error) {
    return NextResponse.json(
      { error: "Could not submit your request right now. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}

export const dynamic = "force-dynamic";
