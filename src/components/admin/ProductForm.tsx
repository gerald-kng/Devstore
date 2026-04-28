"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { saveProductAction } from "@/app/admin/actions";
import { AdminFileUpload } from "./AdminFileUpload";
import { ProductGalleryEditor } from "./ProductGalleryEditor";
import type { CategoryRow } from "@/lib/categories";
import { getProductMainImageUrl } from "@/lib/public-assets";
import type { ProductGalleryImageRow, ProductRow } from "@/types/product";

const featuresPlaceholder = `[
  {"title": "Feature 1", "body": "Description."},
  {"title": "Feature 2", "body": "Description."}
]`;

type Props = {
  product: ProductRow | null;
  categories: CategoryRow[];
  /** Loaded on edit page from `product_images`. */
  galleryImages?: ProductGalleryImageRow[];
};

function Submit() {
  const s = useFormStatus();
  return (
    <button
      type="submit"
      disabled={s.pending}
      className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-zinc-950 disabled:opacity-50"
    >
      {s.pending ? "Saving…" : "Save product"}
    </button>
  );
}

export function ProductForm({ product, categories, galleryImages = [] }: Props) {
  const router = useRouter();
  const [state, formAction] = useFormState(saveProductAction, null);
  const [slugInput, setSlugInput] = useState(product?.slug ?? "");
  const [mainPath, setMainPath] = useState(product?.main_image_path ?? "");
  const [appPath, setAppPath] = useState(product?.app_storage_path ?? "");
  const [videoPath, setVideoPath] = useState(product?.video_storage_path ?? "");
  const [draftGalleryPaths, setDraftGalleryPaths] = useState<string[]>([]);
  const slug = slugInput.trim();

  useEffect(() => {
    if (state && "ok" in state && state.ok) {
      router.push("/admin/products");
    }
  }, [state, router, product]);

  const fid = product?.id;
  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      {fid ? <input type="hidden" name="id" value={fid} /> : null}
      {state && "error" in state && state.error ? (
        <p className="rounded border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {String(state.error)}
        </p>
      ) : null}
      {state && "ok" in state && state.ok ? (
        <p className="text-sm text-emerald-400">Saved. Redirecting…</p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs text-zinc-500">Name</label>
          <input
            name="name"
            className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm"
            defaultValue={product?.name}
            required
          />
        </div>
        <div>
          <label className="text-xs text-zinc-500">URL slug</label>
          <input
            name="slug"
            className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm"
            value={slugInput}
            onChange={(e) => setSlugInput(e.target.value)}
            required
          />
        </div>
      </div>
      <div>
        <label className="text-xs text-zinc-500">Category</label>
        <select
          name="category_id"
          className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm"
          defaultValue={product?.category_id ?? ""}
        >
          <option value="">— None —</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs text-zinc-500">Card summary (short)</label>
        <textarea
          name="summary"
          rows={2}
          className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm"
          defaultValue={product?.summary}
        />
      </div>
      <div>
        <label className="text-xs text-zinc-500">Full description</label>
        <textarea
          name="description"
          rows={5}
          className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm"
          defaultValue={product?.description}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs text-zinc-500">Price</label>
          <input
            name="price_amount"
            type="number"
            step="0.01"
            className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm"
            defaultValue={product?.price_amount ?? 0}
            required
          />
        </div>
        <div>
          <label className="text-xs text-zinc-500">Currency (iso)</label>
          <input
            name="price_currency"
            className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm"
            defaultValue={product?.price_currency ?? "usd"}
            required
          />
        </div>
      </div>
      <div>
        <label className="text-xs text-zinc-500">Features (JSON array)</label>
        <textarea
          name="features_json"
          rows={4}
          className="mt-1 w-full font-mono text-xs"
          defaultValue={JSON.stringify(
            (product?.features as unknown as object) ?? [],
            null,
            2,
          )}
        />
        <p className="text-xs text-zinc-600">Or paste: {featuresPlaceholder}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs text-zinc-500">Sort</label>
          <input
            name="sort_order"
            type="number"
            className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm"
            defaultValue={product?.sort_order ?? 0}
          />
        </div>
        <div className="flex items-end pb-1">
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              name="is_active"
              type="checkbox"
              defaultChecked={product?.is_active !== false}
              className="rounded"
            />
            Active
          </label>
        </div>
      </div>
      <hr className="border-zinc-800" />
      <h3 className="text-sm font-medium text-white">Media & files</h3>
      <AdminFileUpload
        label="Main image (product-images bucket)"
        bucket="product-images"
        fieldName="main_image_path"
        prefix={slug || "general"}
        accept="image/*"
        onPath={(p) => setMainPath(p)}
      />
      <input
        name="main_image_path"
        value={mainPath}
        onChange={(e) => setMainPath(e.target.value)}
        className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-xs"
        placeholder="e.g. general/uuid.png"
      />

      {fid ? (
        <ProductGalleryEditor
          productId={fid}
          slug={slug}
          initialImages={galleryImages}
        />
      ) : (
        <div className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
          <div>
            <p className="text-xs font-medium text-zinc-400">More product images</p>
            <p className="mt-1 text-xs text-zinc-600">
              Optional gallery images to save together with this new product.
            </p>
          </div>
          <AdminFileUpload
            label="Add gallery image"
            bucket="product-images"
            prefix={slug || "general"}
            accept="image/*"
            onPath={(p) =>
              setDraftGalleryPaths((prev) =>
                prev.includes(p) ? prev : [...prev, p],
              )
            }
          />
          <input
            type="hidden"
            name="gallery_paths_json"
            value={JSON.stringify(draftGalleryPaths)}
          />
          {draftGalleryPaths.length > 0 ? (
            <ul className="space-y-2">
              {draftGalleryPaths.map((path) => {
                const previewUrl = getProductMainImageUrl(path);
                return (
                  <li
                    key={path}
                    className="flex items-center gap-3 rounded border border-zinc-800 bg-zinc-950/50 p-2"
                  >
                    {previewUrl ? (
                      <Image
                        src={previewUrl}
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
                      {path}
                    </code>
                    <button
                      type="button"
                      onClick={() =>
                        setDraftGalleryPaths((prev) => prev.filter((x) => x !== path))
                      }
                      className="shrink-0 rounded border border-red-900/50 px-2 py-1 text-xs text-red-300 hover:bg-red-950/40"
                    >
                      Remove
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-xs text-zinc-600">No extra images added yet.</p>
          )}
        </div>
      )}

      <AdminFileUpload
        label="Purchasable app / zip (private downloads bucket)"
        bucket="downloads"
        fieldName="app_storage_path"
        prefix={`products/${slug || "new"}/app`}
        onPath={(p) => setAppPath(p)}
      />
      <input
        name="app_storage_path"
        value={appPath}
        onChange={(e) => setAppPath(e.target.value)}
        className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-xs"
        required
      />

      <AdminFileUpload
        label="Install / delivery video (downloads bucket — sent after pay)"
        bucket="downloads"
        fieldName="video_storage_path"
        prefix={`products/${slug || "new"}/install`}
        accept="video/*"
        onPath={(p) => setVideoPath(p)}
      />
      <input
        name="video_storage_path"
        value={videoPath}
        onChange={(e) => setVideoPath(e.target.value)}
        className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-xs"
        required
      />
      <div>
        <label className="text-xs text-zinc-500">Demo (optional embed URL)</label>
        <input
          name="demo_video_url"
          className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm"
          defaultValue={product?.demo_video_url ?? ""}
          placeholder="https://www.youtube.com/watch?v=… or Vimeo / embed URL"
        />
      </div>
      <Submit />
    </form>
  );
}
