"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteProductAction } from "@/app/admin/actions";

type DeleteProductButtonProps = {
  productId: string;
  productName: string;
};

export function DeleteProductButton({
  productId,
  productName,
}: DeleteProductButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onDelete() {
    const ok = window.confirm(
      `Delete "${productName}"? This cannot be undone and will remove it from the storefront.`,
    );
    if (!ok) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await deleteProductAction(productId);
      if (result && "error" in result && result.error) {
        setError(String(result.error));
        return;
      }
      if (result && "archived" in result && result.archived) {
        window.alert(
          "This product has paid orders, so it was archived (hidden) instead of permanently deleted.",
        );
      }
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onDelete}
        disabled={pending}
        className="text-red-400 hover:underline disabled:opacity-60"
      >
        {pending ? "Deleting..." : "Delete"}
      </button>
      {error ? <span className="text-xs text-red-400">{error}</span> : null}
    </div>
  );
}
