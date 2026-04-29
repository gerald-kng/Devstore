type PageBackdropProps = {
  variant?: "default" | "subtle" | "vivid";
};

/**
 * Layered animated background for inner pages. Drop into any element with
 * `relative` (or `relative isolate`) and `overflow-hidden`.
 */
export function PageBackdrop({ variant = "default" }: PageBackdropProps) {
  const intensity = {
    default: { orb: 0.18, conicOpacity: 0, gridOpacity: 0.45 },
    subtle: { orb: 0.12, conicOpacity: 0, gridOpacity: 0.3 },
    vivid: { orb: 0.25, conicOpacity: 0.4, gridOpacity: 0.6 },
  }[variant];

  return (
    <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
      <div
        className="absolute inset-0 hero-grid"
        style={{ opacity: intensity.gridOpacity }}
      />
      {variant === "vivid" ? (
        <div
          className="absolute -inset-[40%] hero-conic"
          style={{ opacity: intensity.conicOpacity }}
        />
      ) : null}
      <div
        className="hero-orb hero-orb-a absolute -left-32 -top-40 h-[28rem] w-[28rem] rounded-full bg-emerald-500 blur-[130px]"
        style={{ opacity: intensity.orb }}
      />
      <div
        className="hero-orb hero-orb-b absolute -bottom-44 -right-24 h-[28rem] w-[28rem] rounded-full bg-cyan-500 blur-[130px]"
        style={{ opacity: intensity.orb }}
      />
      <div
        className="hero-orb hero-orb-c absolute top-1/3 right-1/3 h-72 w-72 rounded-full bg-violet-500 blur-[110px]"
        style={{ opacity: intensity.orb * 0.85 }}
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/35 to-transparent hero-glow-breathe" />
    </div>
  );
}
