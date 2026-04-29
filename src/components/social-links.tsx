import { getSocialLinks } from "@/lib/social";

type SocialLinksProps = {
  className?: string;
  iconClassName?: string;
};

export async function SocialLinks({
  className = "",
  iconClassName = "h-4 w-4",
}: SocialLinksProps) {
  const links = await getSocialLinks();
  if (links.length === 0) {
    return null;
  }
  return (
    <ul className={`flex flex-wrap items-center gap-2 ${className}`}>
      {links.map(({ key, label, href, icon: Icon }) => {
        const isExternal = href.startsWith("http");
        return (
          <li key={key}>
            <a
              href={href}
              aria-label={label}
              title={label}
              {...(isExternal
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="group relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-400 transition duration-300 hover:-translate-y-0.5 hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-200"
            >
              <span
                className="pointer-events-none absolute inset-0 rounded-lg bg-emerald-500/20 opacity-0 blur-md transition duration-500 group-hover:opacity-100"
                aria-hidden
              />
              <Icon className={`relative ${iconClassName}`} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
