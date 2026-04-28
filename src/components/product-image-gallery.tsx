"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export type ProductGallerySlide = {
  id: string;
  url: string;
  alt: string;
};

export function ProductImageGallery({ slides }: { slides: ProductGallerySlide[] }) {
  const [index, setIndex] = useState(0);
  const slideIds = slides.map((s) => s.id).join("|");
  useEffect(() => {
    setIndex((i) => Math.min(i, Math.max(0, slides.length - 1)));
  }, [slideIds, slides.length]);
  if (slides.length === 0) {
    return null;
  }
  const safe = Math.min(index, slides.length - 1);
  const current = slides[safe]!;

  return (
    <div className="max-w-2xl space-y-4">
      <div className="relative overflow-hidden rounded-2xl border border-white/10">
        <Image
          key={current.id}
          src={current.url}
          alt={current.alt}
          width={800}
          height={450}
          className="h-auto w-full object-cover"
          unoptimized
          priority={safe === 0}
        />
      </div>
      {slides.length > 1 ? (
        <div className="flex flex-wrap gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setIndex(i)}
              className={`relative overflow-hidden rounded-lg border transition ${
                i === safe
                  ? "border-emerald-500/80 ring-2 ring-emerald-500/30"
                  : "border-white/10 opacity-80 hover:opacity-100"
              }`}
              aria-label={`View image ${i + 1}`}
              aria-current={i === safe}
            >
              <Image
                src={slide.url}
                alt=""
                width={96}
                height={64}
                className="h-16 w-24 object-cover"
                unoptimized
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
