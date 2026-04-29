import type { ComponentType, SVGProps } from "react";
import {
  DiscordIcon,
  FacebookIcon,
  GitHubIcon,
  GlobeIcon,
  InstagramIcon,
  LinkedInIcon,
  MailIcon,
  TelegramIcon,
  XIcon,
  YouTubeIcon,
} from "@/components/social-icons";
import { isSupabaseConfigured } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";

export type SocialLink = {
  key: string;
  label: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

type SocialProfile = {
  key: string;
  label: string;
  envVar: string;
  placeholder: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  hrefTransform?: (raw: string) => string;
};

export const SOCIAL_PROFILES: ReadonlyArray<SocialProfile> = [
  {
    key: "x",
    label: "X (Twitter)",
    envVar: "NEXT_PUBLIC_SOCIAL_X",
    placeholder: "https://x.com/yourhandle",
    icon: XIcon,
  },
  {
    key: "github",
    label: "GitHub",
    envVar: "NEXT_PUBLIC_SOCIAL_GITHUB",
    placeholder: "https://github.com/yourhandle",
    icon: GitHubIcon,
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    envVar: "NEXT_PUBLIC_SOCIAL_LINKEDIN",
    placeholder: "https://www.linkedin.com/in/yourhandle",
    icon: LinkedInIcon,
  },
  {
    key: "youtube",
    label: "YouTube",
    envVar: "NEXT_PUBLIC_SOCIAL_YOUTUBE",
    placeholder: "https://www.youtube.com/@yourchannel",
    icon: YouTubeIcon,
  },
  {
    key: "discord",
    label: "Discord",
    envVar: "NEXT_PUBLIC_SOCIAL_DISCORD",
    placeholder: "https://discord.gg/yourinvite",
    icon: DiscordIcon,
  },
  {
    key: "telegram",
    label: "Telegram",
    envVar: "NEXT_PUBLIC_SOCIAL_TELEGRAM",
    placeholder: "https://t.me/yourhandle",
    icon: TelegramIcon,
  },
  {
    key: "instagram",
    label: "Instagram",
    envVar: "NEXT_PUBLIC_SOCIAL_INSTAGRAM",
    placeholder: "https://instagram.com/yourhandle",
    icon: InstagramIcon,
  },
  {
    key: "facebook",
    label: "Facebook",
    envVar: "NEXT_PUBLIC_SOCIAL_FACEBOOK",
    placeholder: "https://facebook.com/yourpage",
    icon: FacebookIcon,
  },
  {
    key: "email",
    label: "Email",
    envVar: "NEXT_PUBLIC_SOCIAL_EMAIL",
    placeholder: "you@example.com",
    icon: MailIcon,
    hrefTransform: (raw) => (raw.startsWith("mailto:") ? raw : `mailto:${raw}`),
  },
  {
    key: "website",
    label: "Website",
    envVar: "NEXT_PUBLIC_SOCIAL_WEBSITE",
    placeholder: "https://yoursite.com",
    icon: GlobeIcon,
  },
];

const PROFILE_BY_KEY: Map<string, SocialProfile> = new Map(
  SOCIAL_PROFILES.map((p) => [p.key, p]),
);

const ALLOWED_PROTOCOLS = new Set(["http:", "https:", "mailto:"]);

function readEnv(name: string): string | null {
  const value = process.env[name];
  if (!value || typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function safeHref(raw: string): string | null {
  try {
    const url = new URL(raw);
    if (!ALLOWED_PROTOCOLS.has(url.protocol)) {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
}

type SocialRow = {
  key: string;
  href: string;
  is_active: boolean;
  sort_order: number;
};

async function fetchSocialRows(): Promise<SocialRow[] | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }
  try {
    const db = createAdminClient();
    const { data, error } = await db
      .from("site_social_links")
      .select("key, href, is_active, sort_order");
    if (error) {
      return null;
    }
    return (data ?? []).map((r) => ({
      key: r.key,
      href: r.href ?? "",
      is_active: r.is_active,
      sort_order: r.sort_order,
    }));
  } catch {
    return null;
  }
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  const rows = await fetchSocialRows();
  const rowByKey = new Map<string, SocialRow>();
  for (const row of rows ?? []) {
    rowByKey.set(row.key, row);
  }

  type Resolved = SocialLink & { sort_order: number; catalogIndex: number };
  const out: Resolved[] = [];

  SOCIAL_PROFILES.forEach((profile, catalogIndex) => {
    const row = rowByKey.get(profile.key);
    let raw: string | null = null;
    let sort_order = catalogIndex;

    if (row) {
      if (!row.is_active) return;
      const trimmed = row.href.trim();
      raw = trimmed.length > 0 ? trimmed : null;
      sort_order = row.sort_order;
    }

    // Fall back to env when DB has nothing for this profile yet.
    if (!raw && (rows === null || !row)) {
      raw = readEnv(profile.envVar);
    }
    if (!raw) return;

    const candidate = profile.hrefTransform ? profile.hrefTransform(raw) : raw;
    const href = safeHref(candidate);
    if (!href) return;

    out.push({
      key: profile.key,
      label: profile.label,
      href,
      icon: profile.icon,
      sort_order,
      catalogIndex,
    });
  });

  out.sort((a, b) => {
    if (a.sort_order !== b.sort_order) {
      return a.sort_order - b.sort_order;
    }
    return a.catalogIndex - b.catalogIndex;
  });

  return out.map(({ key, label, href, icon }) => ({ key, label, href, icon }));
}

export type SocialLinkSetting = {
  key: string;
  label: string;
  placeholder: string;
  envVar: string;
  href: string;
  is_active: boolean;
  sort_order: number;
};

export async function getSocialLinkSettings(): Promise<SocialLinkSetting[]> {
  const rows = await fetchSocialRows();
  const rowByKey = new Map<string, SocialRow>();
  for (const row of rows ?? []) {
    rowByKey.set(row.key, row);
  }
  return SOCIAL_PROFILES.map((profile, idx) => {
    const row = rowByKey.get(profile.key);
    return {
      key: profile.key,
      label: profile.label,
      placeholder: profile.placeholder,
      envVar: profile.envVar,
      href: row?.href ?? "",
      is_active: row?.is_active ?? true,
      sort_order: row?.sort_order ?? idx,
    };
  });
}
