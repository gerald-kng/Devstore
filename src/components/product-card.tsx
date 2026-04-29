import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatProductPrice } from "@/lib/products";
import { getProductMainImageUrl } from "@/lib/public-assets";
import type { ProductListItem } from "@/types/product";

type ProductCardProps = {
  product: ProductListItem;
  delayMs?: number;
  showCategory?: boolean;
};

export function ProductCard({
  product,
  delayMs = 0,
  showCategory = true,
}: ProductCardProps) {
  const image = getProductMainImageUrl(product.main_image_path);
  return (
    <article
      className="reveal reveal-scale glass-card card-glow group flex h-full flex-col"
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      <Link
        href={`/products/${product.slug}`}
        className="flex h-full flex-col"
        aria-label={product.name}
      >
        <div className="relative h-44 w-full overflow-hidden bg-zinc-800/80">
          {image ? (
            <Image
              src={image}
              alt=""
              fill
              className="object-cover transition duration-700 group-hover:scale-110"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-cyan-500/15 to-violet-500/20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/10 to-transparent" />
          {showCategory && product.category ? (
            <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-emerald-200 backdrop-blur">
              {product.category.name}
            </span>
          ) : null}
        </div>

        <div className="relative flex flex-1 flex-col p-6">
          <h2 className="text-lg font-semibold tracking-tight text-white transition group-hover:text-emerald-200">
            {product.name}
          </h2>
          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-zinc-400">
            {product.summary}
          </p>
          <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/10 pt-4">
            <span className="text-base font-semibold text-emerald-300">
              {formatProductPrice(product)}
            </span>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-zinc-400 transition group-hover:text-emerald-200">
              View
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden
              />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
