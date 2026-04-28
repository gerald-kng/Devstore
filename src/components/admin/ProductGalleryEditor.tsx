"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import {
  addProductGalleryImageAction,
  deleteProductGalleryImageAction,
} from "@/app/admin/actions";
import { AdminFileUpload } from "@/components/admin/AdminFileUpload";
import { getProductMainImageUrl } from "@/lib/public-assets";
import type { ProductGalleryImageRow } from "@/types/product";

type Props = {
  productId: string;
  slug: string;
  initialImages: ProductGalleryImageRow[];
};

export function ProductGalleryEditor({ productId, slug, initialImages }: Props) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function onUploadedPath(storagePath: string) {
    setError(null);
    setAdding(true);
    try {
      const fd = new FormData();
      fd.set("product_id", productId);
      fd.set("storage_path", storagePath);
      fd.set("alt_text", "");
      const res = await addProductGalleryImageAction(fd);
      if (res && "error" in res && res.error) {
        setError(String(res.error));
        return;
      }
      router.refresh();
    } finally {
      setAdding(false);
    }
  }

  async function remove(imageId: string) {
    setError(null);
    setDeletingId(imageId);
    try {
      const fd = new FormData();
      fd.set("product_id", productId);
      fd.set("image_id", imageId);
      const res = await deleteProductGalleryImageAction(fd);
      if (res && "error" in res && res.error) {
        setError(String(res.error));
        return;
      }
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  const prefix = slug || "general";

  return (
    <div className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
      <div>
        <p className="text-xs font-medium text-zinc-400">More product images</p>
        <p className="mt-1 text-xs text-zinc-600">
          Shown on the public product page in the image gallery (after the main
          image). Files go in the public <code className="text-zinc-500">product-images</code>{" "}
          bucket.
        </p>
      </div>
      <div className={adding ? "pointer-events-none opacity-60" : ""}>
        <AdminFileUpload
          label="Add gallery image"
          bucket="product-images"
          prefix={prefix}
          accept="image/*"
          onPath={onUploadedPath}
        />
      </div>
      {adding ? <p className="text-xs text-zinc-500">Saving to catalog…</p> : null}
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
      {initialImages.length > 0 ? (
        <ul className="space-y-2">
          {initialImages.map((img) => {
            const url = getProductMainImageUrl(img.storage_path);
            return (
              <li
                key={img.id}
                className="flex items-center gap-3 rounded border border-zinc-800 bg-zinc-950/50 p-2"
              >
                {url ? (
                  <Image
                    src={url}
                    alt=""
                    width={72}
                    height={48}
                    className="h-12 w-16 shrink-0 rounded object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded bg-zinc-800 text-[10px] text-zinc-500">
                    ?
                  </div>
                )}
                <code className="min-w-0 flex-1 truncate text-[10px] text-zinc-500">
                  {img.storage_path}
                </code>
                <button
                  type="button"
                  disabled={adding || deletingId === img.id}
                  onClick={() => remove(img.id)}
                  className="shrink-0 rounded border border-red-900/50 px-2 py-1 text-xs text-red-300 hover:bg-red-950/40 disabled:opacity-50"
                >
                  {deletingId === img.id ? "…" : "Remove"}
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-xs text-zinc-600">No extra images yet.</p>
      )}
    </div>
  );
}
