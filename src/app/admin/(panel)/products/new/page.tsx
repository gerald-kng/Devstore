import { ProductForm } from "@/components/admin/ProductForm";
import { listAllCategoryRows } from "@/lib/categories";
import { isSupabaseConfigured } from "@/lib/env";

export default async function NewProductPage() {
  if (!isSupabaseConfigured()) {
    return <p>Supabase is not configured.</p>;
  }
  const categories = await listAllCategoryRows();
  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">New product</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Upload files to storage, then the paths are saved on the product. Purchasable file
        and install video go in the private <code>downloads</code> bucket; images in{" "}
        <code>product-images</code>.
      </p>
      <div className="mt-8">
        <ProductForm product={null} categories={categories} />
      </div>
    </div>
  );
}
