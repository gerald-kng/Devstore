/**
 * Converts paste-style links (YouTube watch, youtu.be, Vimeo page, Loom share)
 * into iframe-safe URLs, or flags obvious direct media for <video>.
 */
export function resolveStreamingDemoUrl(
  raw: string | null | undefined,
): { player: "iframe" | "html5"; src: string } | null {
  if (!raw) {
    return null;
  }
  let u = raw.trim();
  if (!u) {
    return null;
  }
  if (u.startsWith("//")) {
    u = `https:${u}`;
  }
  if (u.startsWith("http://")) {
    u = `https://${u.slice("http://".length)}`;
  }
  if (!u.startsWith("https://")) {
    return null;
  }

  let parsed: URL;
  try {
    parsed = new URL(u);
  } catch {
    return null;
  }

  const host = parsed.hostname.toLowerCase().replace(/^www\./, "");

  // YouTube (www. stripped above; hostname may still be www.youtube.com → becomes youtube.com)
  const ytHost =
    host === "youtube.com" ||
    host === "m.youtube.com" ||
    host === "youtube-nocookie.com";
  if (ytHost) {
    const embedBase =
      host === "youtube-nocookie.com"
        ? "https://www.youtube-nocookie.com"
        : "https://www.youtube.com";
    if (parsed.pathname === "/watch" || parsed.pathname === "/watch/") {
      const v = parsed.searchParams.get("v");
      if (v) {
        return {
          player: "iframe",
          src: `${embedBase}/embed/${encodeURIComponent(v)}`,
        };
      }
    }
    if (parsed.pathname.startsWith("/embed/")) {
      return { player: "iframe", src: u };
    }
    if (parsed.pathname.startsWith("/shorts/")) {
      const id = parsed.pathname
        .slice("/shorts/".length)
        .split("/")
        .filter(Boolean)[0];
      if (id) {
        return {
          player: "iframe",
          src: `${embedBase}/embed/${encodeURIComponent(id)}`,
        };
      }
    }
    if (parsed.pathname.startsWith("/live/")) {
      const id = parsed.pathname
        .slice("/live/".length)
        .split("/")
        .filter(Boolean)[0];
      if (id) {
        return {
          player: "iframe",
          src: `${embedBase}/embed/${encodeURIComponent(id)}`,
        };
      }
    }
  }

  if (host === "youtu.be") {
    const id = parsed.pathname.slice(1).split("/").filter(Boolean)[0];
    if (id) {
      return {
        player: "iframe",
        src: `https://www.youtube.com/embed/${encodeURIComponent(id)}`,
      };
    }
  }

  if (host === "vimeo.com") {
    const parts = parsed.pathname.split("/").filter(Boolean);
    const id = parts[0];
    if (id && /^\d+$/.test(id)) {
      return {
        player: "iframe",
        src: `https://player.vimeo.com/video/${id}`,
      };
    }
  }
  if (host === "player.vimeo.com") {
    return { player: "iframe", src: u };
  }

  if (host === "loom.com" && parsed.pathname.startsWith("/share/")) {
    const id = parsed.pathname
      .slice("/share/".length)
      .split("/")
      .filter(Boolean)[0];
    if (id) {
      return {
        player: "iframe",
        src: `https://www.loom.com/embed/${encodeURIComponent(id)}`,
      };
    }
  }

  if (/\.(mp4|webm|ogg|mov)(\?|#|$)/i.test(parsed.pathname)) {
    return { player: "html5", src: u };
  }

  if (parsed.pathname.includes("/embed")) {
    return { player: "iframe", src: u };
  }

  return { player: "iframe", src: u };
}
