import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

type CtaAction = {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
  icon?: "right" | "upRight";
};

type CtaBannerProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: CtaAction[];
  className?: string;
};

const defaultActions: CtaAction[] = [
  { href: "/products", label: "Browse products", variant: "primary", icon: "right" },
  { href: "/contact", label: "Talk to us", variant: "secondary", icon: "upRight" },
];

const primaryClass =
  "inline-flex items-center gap-2 rounded-xl border border-emerald-400/50 bg-emerald-500/15 px-5 py-2.5 text-sm font-medium text-emerald-200 shadow-[0_0_50px_-12px_rgba(16,185,129,0.7)] transition hover:border-emerald-300 hover:text-white";
const secondaryClass =
  "inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-emerald-500/30 hover:text-emerald-200";

export function CtaBanner({
  title,
  description,
  actions,
  className = "",
}: CtaBannerProps) {
  const finalActions = actions ?? defaultActions;
  const headline = title ?? (
    <>
      Ready to ship something <span className="hero-shimmer">extraordinary?</span>
    </>
  );
  const sub =
    description ??
    "Browse the marketplace, pick the toolkit that fits your stack, and start building today.";

  return (
    <section
      aria-label="Call to action"
      className={`reveal ${className}`}
    >
      <div className="section-hairline mb-10 hero-glow-breathe" />
      <div className="glass-card relative overflow-hidden p-8 sm:p-12">
        <div
          className="hero-orb hero-orb-a pointer-events-none absolute -left-16 -top-20 h-72 w-72 rounded-full bg-emerald-500/25 blur-[110px]"
          aria-hidden
        />
        <div
          className="hero-orb hero-orb-c pointer-events-none absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-violet-500/25 blur-[110px]"
          aria-hidden
        />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {headline}
            </h2>
            <p className="mt-2 max-w-xl text-sm text-zinc-400">{sub}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {finalActions.map((action) => {
              const Icon = action.icon === "upRight" ? ArrowUpRight : ArrowRight;
              const isPrimary = (action.variant ?? "primary") === "primary";
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className={isPrimary ? primaryClass : secondaryClass}
                >
                  {action.label}
                  <Icon className="h-4 w-4" aria-hidden />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
