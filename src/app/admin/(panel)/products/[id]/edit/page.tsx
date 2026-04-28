import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { listAllCategoryRows } from "@/lib/categories";
import { isSupabaseConfigured } from "@/lib/env";
import { getProductImageGallery } from "@/lib/product-media";
import { getProductById } from "@/lib/products";
import { isUuid } from "@/lib/validation";

type P = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: P) {
  const { id } = await params;
  if (!isUuid(id)) {
    notFound();
  }
  if (!isSupabaseConfigured()) {
    return <p>Supabase is not configured.</p>;
  }
  const [product, categories, gallery] = await Promise.all([
    getProductById(id),
    listAllCategoryRows(),
    getProductImageGallery(id),
  ]);
  if (!product) {
    notFound();
  }
  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Edit product</h1>
      <p className="mt-1 font-mono text-xs text-zinc-500">{product.slug}</p>
      <div className="mt-8">
        <ProductForm
          product={product}
          categories={categories}
          galleryImages={gallery}
        />
      </div>
    </div>
  );
}
