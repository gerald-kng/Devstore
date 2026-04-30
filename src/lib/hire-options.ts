export type Option = { value: string; label: string };

export const PROJECT_TYPES: Option[] = [
  { value: "webapp", label: "Web app / SaaS" },
  { value: "mobile", label: "Mobile app" },
  { value: "automation", label: "Automation / scripts" },
  { value: "integration", label: "API / integration work" },
  { value: "ai-bot", label: "AI agent / bot" },
  { value: "ecommerce", label: "E-commerce / storefront" },
  { value: "landing", label: "Landing page / website" },
  { value: "other", label: "Other" },
];

export const BUDGET_RANGES: Option[] = [
  { value: "under-1k", label: "Under $1,000" },
  { value: "1k-5k", label: "$1,000 – $5,000" },
  { value: "5k-15k", label: "$5,000 – $15,000" },
  { value: "15k-50k", label: "$15,000 – $50,000" },
  { value: "50k-plus", label: "$50,000+" },
  { value: "discuss", label: "Let's discuss" },
];

export const TIMELINES: Option[] = [
  { value: "asap", label: "ASAP (within 1 week)" },
  { value: "1-2-weeks", label: "1–2 weeks" },
  { value: "1-month", label: "About 1 month" },
  { value: "1-3-months", label: "1–3 months" },
  { value: "flexible", label: "Flexible / not urgent" },
];

export const CONTACT_METHODS: Option[] = [
  { value: "email", label: "Email" },
  { value: "discord", label: "Discord" },
  { value: "telegram", label: "Telegram" },
  { value: "call", label: "Scheduled call" },
];

export const PROJECT_TYPE_VALUES = new Set(PROJECT_TYPES.map((o) => o.value));
export const BUDGET_RANGE_VALUES = new Set(BUDGET_RANGES.map((o) => o.value));
export const TIMELINE_VALUES = new Set(TIMELINES.map((o) => o.value));
export const CONTACT_METHOD_VALUES = new Set(CONTACT_METHODS.map((o) => o.value));

export function labelFor(options: Option[], value: string): string {
  return options.find((o) => o.value === value)?.label ?? value;
}
