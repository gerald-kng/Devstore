import { createCategoryAction } from "@/app/admin/actions";
import { DeleteCategoryButton } from "./DeleteCategoryButton";

type CreateProps = {
  action: typeof createCategoryAction;
  title: string;
};

export function CategoryFormCreate({ action, title }: CreateProps) {
  return (
    <div className="max-w-md rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
      <h2 className="text-sm font-medium text-white">{title}</h2>
      <form action={action} className="mt-3 space-y-2">
        <input
          name="name"
          className="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm"
          placeholder="Name"
          required
        />
        <input
          name="slug"
          className="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm"
          placeholder="url-slug"
          required
        />
        <textarea
          name="description"
          rows={2}
          className="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm"
        />
        <div className="flex gap-2">
          <input
            name="sort_order"
            type="number"
            defaultValue={0}
            className="w-20 rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm"
          />
          <label className="flex items-center gap-1 text-sm">
            <input name="is_active" type="checkbox" defaultChecked />
            Active
          </label>
        </div>
        <button
          type="submit"
          className="rounded bg-emerald-500 px-3 py-1.5 text-sm font-medium text-zinc-950"
        >
          Add
        </button>
      </form>
    </div>
  );
}

type Item = {
  id: string;
  name: string;
  slug: string;
  description: string;
  sort_order: number;
  is_active: boolean;
};

type ListProps = { items: Item[] };

export function CategoryListTable({ items }: ListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-zinc-300">
        <thead>
          <tr className="border-b border-zinc-800 text-zinc-500">
            <th className="py-2 pr-2">Name</th>
            <th className="py-2 pr-2">Slug</th>
            <th className="py-2 pr-2">Order</th>
            <th className="py-2">Active</th>
            <th className="py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-6 text-zinc-500">
                No categories yet.
              </td>
            </tr>
          ) : (
            items.map((c) => (
              <tr key={c.id} className="border-b border-zinc-800/80">
                <td className="py-2 pr-2 text-white">{c.name}</td>
                <td className="pr-2 font-mono text-xs text-zinc-500">{c.slug}</td>
                <td className="pr-2">{c.sort_order}</td>
                <td className="text-zinc-500">{c.is_active ? "Yes" : "No"}</td>
                <td className="text-right">
                  <DeleteCategoryButton categoryId={c.id} categoryName={c.name} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <p className="mt-4 text-xs text-zinc-500">
        Inline editing can be added later; for now add categories and assign products in
        the product editor.
      </p>
    </div>
  );
}
