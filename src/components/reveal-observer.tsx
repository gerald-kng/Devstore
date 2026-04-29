"use client";

import { useEffect } from "react";

/**
 * Mounts a single IntersectionObserver that promotes any `.reveal` element to
 * `.is-visible` when it enters the viewport. Also watches for elements added
 * later via Next.js client-side route changes.
 */
export function RevealObserver() {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const reduceMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    if (reduceMotion) {
      document
        .querySelectorAll<HTMLElement>(".reveal")
        .forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries, observer) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    const observeAll = (root: ParentNode = document) => {
      root
        .querySelectorAll<HTMLElement>(".reveal:not(.is-visible)")
        .forEach((el) => io.observe(el));
    };
    observeAll();

    const mo = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of Array.from(mutation.addedNodes)) {
          if (node.nodeType !== 1) continue;
          const el = node as HTMLElement;
          if (
            el.classList?.contains("reveal") &&
            !el.classList.contains("is-visible")
          ) {
            io.observe(el);
          }
          if (typeof el.querySelectorAll === "function") {
            el.querySelectorAll<HTMLElement>(
              ".reveal:not(.is-visible)",
            ).forEach((child) => io.observe(child));
          }
        }
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
