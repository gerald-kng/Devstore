"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createOrderAccessLink, revokeOrderAccess } from "@/lib/access";
import { sendAccessLinkEmail } from "@/lib/email";
import { getServiceRoleIfAdmin } from "@/lib/auth/get-admin";
import { createClient } from "@/lib/supabase/server";
import { getProductById } from "@/lib/products";
import { SOCIAL_PROFILES } from "@/lib/social";
import type { Database } from "@/types/database";

function toUrlSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  revalidatePath("/admin/orders");
  revalidatePath("/admin/engagement");
  revalidatePath("/admin/site-pages");
  revalidatePath("/admin/social-links");
  revalidatePath("/admin/hire");
  revalidatePath("/c", "layout");
}

async function revalidateProductStorefront(productId: string) {
  const ctx = await getServiceRoleIfAdmin();
  if (!ctx) {
    return;
  }
  const { data } = await ctx.db
    .from("products")
    .select("slug")
    .eq("id", productId)
    .maybeSingle();
  if (data?.slug) {
    revalidatePath(`/products/${data.slug}`);
  }
  revalidatePath("/");
}

export async function createCategoryAction(formData: FormData) {
  const ctx = await getServiceRoleIfAdmin();
  if (!ctx) {
    throw new Error("Unauthorized");
  }
  const name = String(formData.get("name") ?? "").trim();
  const slug = toUrlSlug(String(formData.get("slug") ?? ""));
  const description = String(formData.get("description") ?? "");
  const sortOrder = Number(formData.get("sort_order") ?? 0);
  const isActive = formData.get("is_active") === "on";
  if (!name || !slug) {
    throw new Error("Name and slug required");
  }

  // Keep category creation idempotent by slug to avoid unique-key runtime errors.
  const { data: existing, error: existingError } = await ctx.db
    .from("product_categories")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (existingError) {
    throw new Error(existingError.message);
  }

  if (existing?.id) {
    const { error: updateError } = await ctx.db
      .from("product_categories")
      .update({
        name,
        description,
        sort_order: sortOrder,
        is_active: isActive,
      })
      .eq("id", existing.id);
    if (updateError) {
      throw new Error(updateError.message);
    }
  } else {
    const { error } = await ctx.db.from("product_categories").insert({
      name,
      slug,
      description,
      sort_order: sortOrder,
      is_active: isActive,
    });
    if (error) {
      throw new Error(error.message);
    }
  }
  revalidateAll();
}

export async function deleteCategoryAction(formData: FormData) {
  const ctx = await getServiceRoleIfAdmin();
  if (!ctx) {
    throw new Error("Unauthorized");
  }
  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    throw new Error("Category id is required");
  }

  // Prevent FK failures: detach products from this category before delete.
  const { error: detachError } = await ctx.db
    .from("products")
    .update({ category_id: null })
    .eq("category_id", id);
  if (detachError) {
    throw new Error(detachError.message);
  }

  const { error } = await ctx.db.from("product_categories").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  revalidateAll();
}

export async function saveProductAction(
  _prev: unknown,
  formData: FormData,
) {
  const ctx = await getServiceRoleIfAdmin();
  if (!ctx) {
    return { error: "Unauthorized" };
  }
  const id = String(formData.get("id") ?? "");
  const slug = toUrlSlug(String(formData.get("slug") ?? ""));
  const name = String(formData.get("name") ?? "").trim();
  if (!name || !slug) {
    return { error: "Name and slug required" };
  }
  let features: unknown = [];
  try {
    const raw = String(formData.get("features_json") ?? "[]");
    features = JSON.parse(raw);
  } catch {
    return { error: "Features must be valid JSON" };
  }
  const row = {
    name,
    slug,
    summary: String(formData.get("summary") ?? ""),
    description: String(formData.get("description") ?? ""),
    price_amount: Number(formData.get("price_amount") ?? 0),
    price_currency: String(
      formData.get("price_currency") ?? "usd",
    ).toLowerCase(),
    app_storage_path: String(formData.get("app_storage_path") ?? "").trim(),
    video_storage_path: String(formData.get("video_storage_path") ?? "").trim(),
    demo_video_url: (() => {
      const v = String(formData.get("demo_video_url") ?? "").trim();
      return v.length > 0 ? v : null;
    })(),
    main_image_path: (() => {
      const v = String(formData.get("main_image_path") ?? "").trim();
      return v.length > 0 ? v : null;
    })(),
    category_id: (() => {
      const v = String(formData.get("category_id") ?? "").trim();
      return v.length > 0 ? v : null;
    })(),
    features,
    is_active: formData.get("is_active") === "on",
    sort_order: Number(formData.get("sort_order") ?? 0),
  };
  if (row.app_storage_path.length < 1 || row.video_storage_path.length < 1) {
    return { error: "App file path and install video path are required" };
  }
  if (id) {
    const { error, data } = await ctx.db
      .from("products")
      .update({
        name: row.name,
        slug: row.slug,
        summary: row.summary,
        description: row.description,
        price_amount: row.price_amount,
        price_currency: row.price_currency,
        app_storage_path: row.app_storage_path,
        video_storage_path: row.video_storage_path,
        demo_video_url: row.demo_video_url,
        main_image_path: row.main_image_path,
        category_id: row.category_id,
        features,
        is_active: row.is_active,
        sort_order: row.sort_order,
      })
      .eq("id", id)
      .select("id, slug");
    if (error) {
      return { error: error.message };
    }
    revalidateAll();
    return {
      ok: true as const,
      id: data?.[0]?.id,
      slug: data?.[0]?.slug ?? slug,
    };
  }
  let draftGalleryPaths: string[] = [];
  try {
    const rawGallery = String(formData.get("gallery_paths_json") ?? "[]");
    const parsed = JSON.parse(rawGallery);
    if (Array.isArray(parsed)) {
      draftGalleryPaths = parsed
        .filter((v): v is string => typeof v === "string")
        .map((v) => v.trim())
        .filter((v) => v.length > 0);
    }
  } catch {
    draftGalleryPaths = [];
  }
  const insert: Database["public"]["Tables"]["products"]["Insert"] = {
    name: row.name,
    slug: row.slug,
    summary: row.summary,
    description: row.description,
    price_amount: row.price_amount,
    price_currency: row.price_currency,
    app_storage_path: row.app_storage_path,
    video_storage_path: row.video_storage_path,
    demo_video_url: row.demo_video_url,
    main_image_path: row.main_image_path,
    category_id: row.category_id,
    features,
    is_active: row.is_active,
    sort_order: row.sort_order,
  };
  const { error, data } = await ctx.db
    .from("products")
    .insert(insert)
    .select("id, slug");
  if (error) {
    return { error: error.message };
  }
  const createdProductId = data?.[0]?.id;
  if (createdProductId && draftGalleryPaths.length > 0) {
    const galleryRows = draftGalleryPaths.map((path, index) => ({
      product_id: createdProductId,
      storage_path: path,
      alt_text: "",
      sort_order: index,
    }));
    const { error: galleryError } = await ctx.db
      .from("product_images")
      .insert(galleryRows);
    if (galleryError) {
      return { error: galleryError.message };
    }
  }
  revalidateAll();
  return {
    ok: true as const,
    id: data?.[0]?.id,
    slug: data?.[0]?.slug,
  };
}

export async function deleteProductAction(id: string) {
  const ctx = await getServiceRoleIfAdmin();
  if (!ctx) {
    return { error: "Unauthorized" };
  }
  const { count: paidCount, error: paidCheckError } = await ctx.db
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("product_id", id)
    .eq("status", "paid");
  if (paidCheckError) {
    return { error: paidCheckError.message };
  }
  if ((paidCount ?? 0) > 0) {
    const { error: archiveError } = await ctx.db
      .from("products")
      .update({ is_active: false })
      .eq("id", id);
    if (archiveError) {
      return { error: archiveError.message };
    }
    revalidateAll();
    return {
      ok: true as const,
      archived: true as const,
      message:
        "Product has paid orders, so it was archived (hidden) instead of deleted.",
    };
  }

  // No paid orders: clear unpaid history rows so FK no longer blocks hard delete.
  const { error: purgeUnpaidError } = await ctx.db
    .from("orders")
    .delete()
    .eq("product_id", id)
    .neq("status", "paid");
  if (purgeUnpaidError) {
    return { error: purgeUnpaidError.message };
  }

  const { error } = await ctx.db.from("products").delete().eq("id", id);
  if (error) {
    return { error: error.message };
  }
  revalidateAll();
  return { ok: true as const };
}

export async function addProductGalleryImageAction(formData: FormData) {
  const ctx = await getServiceRoleIfAdmin();
  if (!ctx) {
    return { error: "Unauthorized" };
  }
  const productId = String(formData.get("product_id") ?? "").trim();
  const storagePath = String(formData.get("storage_path") ?? "").trim();
  const altText = String(formData.get("alt_text") ?? "").trim();
  if (!productId || !storagePath) {
    return { error: "Product and image path are required" };
  }
  const { data: maxRow } = await ctx.db
    .from("product_images")
    .select("sort_order")
    .eq("product_id", productId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextSort = (maxRow?.sort_order ?? -1) + 1;
  const { error } = await ctx.db.from("product_images").insert({
    product_id: productId,
    storage_path: storagePath,
    alt_text: altText,
    sort_order: nextSort,
  });
  if (error) {
    return { error: error.message };
  }
  revalidatePath(`/admin/products/${productId}/edit`);
  await revalidateProductStorefront(productId);
  return { ok: true as const };
}

export async function deleteProductGalleryImageAction(formData: FormData) {
  const ctx = await getServiceRoleIfAdmin();
  if (!ctx) {
    return { error: "Unauthorized" };
  }
  const productId = String(formData.get("product_id") ?? "").trim();
  const imageId = String(formData.get("image_id") ?? "").trim();
  if (!productId || !imageId) {
    return { error: "Missing product or image" };
  }
  const { data, error } = await ctx.db
    .from("product_images")
    .delete()
    .eq("id", imageId)
    .eq("product_id", productId)
    .select("id");
  if (error) {
    return { error: error.message };
  }
  if (!data?.length) {
    return { error: "Image not found" };
  }
  revalidatePath(`/admin/products/${productId}/edit`);
  await revalidateProductStorefront(productId);
  return { ok: true as const };
}

export async function saveStaticPageAction(
  _prev: unknown,
  formData: FormData,
) {
  const ctx = await getServiceRoleIfAdmin();
  if (!ctx) {
    return { error: "Unauthorized" };
  }
  const id = String(formData.get("id") ?? "");
  const slug = toUrlSlug(String(formData.get("slug") ?? ""));
  const title = String(formData.get("title") ?? "").trim();
  if (!slug || !title) {
    return { error: "Title and slug required" };
  }
  const pageRow = {
    slug,
    title,
    body: String(formData.get("body") ?? ""),
    is_published: formData.get("is_published") === "on",
    nav_label: (() => {
      const s = String(formData.get("nav_label") ?? "").trim();
      return s.length > 0 ? s : null;
    })(),
    show_in_header: formData.get("show_in_header") === "on",
    show_in_footer: formData.get("show_in_footer") === "on",
    sort_order: Number(formData.get("sort_order") ?? 0),
    updated_at: new Date().toISOString(),
  };
  if (id) {
    const { error } = await ctx.db
      .from("static_pages")
      .update(pageRow)
      .eq("id", id);
    if (error) {
      return { error: error.message };
    }
  } else {
    const ins: Database["public"]["Tables"]["static_pages"]["Insert"] = {
      slug: pageRow.slug,
      title: pageRow.title,
      body: pageRow.body,
      is_published: pageRow.is_published,
      nav_label: pageRow.nav_label,
      show_in_header: pageRow.show_in_header,
      show_in_footer: pageRow.show_in_footer,
      sort_order: pageRow.sort_order,
    };
    const { error } = await ctx.db.from("static_pages").insert(ins);
    if (error) {
      return { error: error.message };
    }
  }
  revalidateAll();
  return { ok: true as const };
}

export async function resendAccessLinkAction(formData: FormData) {
  const ctx = await getServiceRoleIfAdmin();
  if (!ctx) {
    throw new Error("Unauthorized");
  }
  const orderId = String(formData.get("order_id") ?? "");
  const { data: order, error } = await ctx.db
    .from("orders")
    .select("id, customer_email, product_id, status")
    .eq("id", orderId)
    .maybeSingle();
  if (error || !order || order.status !== "paid") {
    throw new Error("Order is not eligible for access link");
  }
  const product = await getProductById(order.product_id);
  if (!product) {
    throw new Error("Product missing");
  }
  const accessPortalUrl = await createOrderAccessLink(order.id);
  await sendAccessLinkEmail({
    to: order.customer_email,
    orderId: order.id,
    productName: product.name,
    accessPortalUrl,
  });
  revalidatePath("/admin/orders");
}

export async function revokeAccessAction(formData: FormData) {
  const ctx = await getServiceRoleIfAdmin();
  if (!ctx) {
    throw new Error("Unauthorized");
  }
  const orderId = String(formData.get("order_id") ?? "");
  await revokeOrderAccess(orderId);
  revalidatePath("/admin/orders");
}

export async function replyProductCommentAction(formData: FormData) {
  const ctx = await getServiceRoleIfAdmin();
  if (!ctx) {
    throw new Error("Unauthorized");
  }
  const id = String(formData.get("id") ?? "").trim();
  const adminReply = String(formData.get("admin_reply") ?? "").trim();
  if (!id) {
    throw new Error("Comment id is required");
  }
  const { data: row, error: rowError } = await ctx.db
    .from("product_comments")
    .select("product_id")
    .eq("id", id)
    .maybeSingle();
  if (rowError || !row?.product_id) {
    throw new Error("Comment not found");
  }
  const { error } = await ctx.db
    .from("product_comments")
    .update({ admin_reply: adminReply.length > 0 ? adminReply : null })
    .eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath("/admin/engagement");
  await revalidateProductStorefront(row.product_id);
}

export async function deleteProductCommentAction(formData: FormData) {
  const ctx = await getServiceRoleIfAdmin();
  if (!ctx) {
    throw new Error("Unauthorized");
  }
  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    throw new Error("Comment id is required");
  }
  const { data: row, error: rowError } = await ctx.db
    .from("product_comments")
    .select("product_id")
    .eq("id", id)
    .maybeSingle();
  if (rowError || !row?.product_id) {
    throw new Error("Comment not found");
  }
  const { error } = await ctx.db.from("product_comments").update({ is_deleted: true }).eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath("/admin/engagement");
  await revalidateProductStorefront(row.product_id);
}

export async function replySiteReviewAction(formData: FormData) {
  const ctx = await getServiceRoleIfAdmin();
  if (!ctx) {
    throw new Error("Unauthorized");
  }
  const id = String(formData.get("id") ?? "").trim();
  const adminReply = String(formData.get("admin_reply") ?? "").trim();
  if (!id) {
    throw new Error("Review id is required");
  }
  const { error } = await ctx.db
    .from("site_reviews")
    .update({ admin_reply: adminReply.length > 0 ? adminReply : null })
    .eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath("/admin/engagement");
  revalidatePath("/");
}

export async function deleteSiteReviewAction(formData: FormData) {
  const ctx = await getServiceRoleIfAdmin();
  if (!ctx) {
    throw new Error("Unauthorized");
  }
  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    throw new Error("Review id is required");
  }
  const { error } = await ctx.db.from("site_reviews").update({ is_deleted: true }).eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath("/admin/engagement");
  revalidatePath("/");
}

export async function replyProductReviewAction(formData: FormData) {
  const ctx = await getServiceRoleIfAdmin();
  if (!ctx) {
    throw new Error("Unauthorized");
  }
  const id = String(formData.get("id") ?? "").trim();
  const adminReply = String(formData.get("admin_reply") ?? "").trim();
  if (!id) {
    throw new Error("Review id is required");
  }
  const { data: row, error: rowError } = await ctx.db
    .from("product_reviews")
    .select("product_id")
    .eq("id", id)
    .maybeSingle();
  if (rowError || !row?.product_id) {
    throw new Error("Review not found");
  }
  const { error } = await ctx.db
    .from("product_reviews")
    .update({ admin_reply: adminReply.length > 0 ? adminReply : null })
    .eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath("/admin/engagement");
  await revalidateProductStorefront(row.product_id);
}

export async function updateHireRequestAction(formData: FormData) {
  const ctx = await getServiceRoleIfAdmin();
  if (!ctx) {
    throw new Error("Unauthorized");
  }
  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    throw new Error("Hire request id is required");
  }
  const adminNotes = String(formData.get("admin_notes") ?? "");
  const isHandled = formData.get("is_handled") === "on";
  const { error } = await ctx.db
    .from("hire_requests")
    .update({ admin_notes: adminNotes, is_handled: isHandled })
    .eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath("/admin/hire");
}

export async function deleteHireRequestAction(formData: FormData) {
  const ctx = await getServiceRoleIfAdmin();
  if (!ctx) {
    throw new Error("Unauthorized");
  }
  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    throw new Error("Hire request id is required");
  }
  const { error } = await ctx.db.from("hire_requests").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath("/admin/hire");
}

const SOCIAL_KEY_SET = new Set(SOCIAL_PROFILES.map((p) => p.key));

export async function saveSocialLinksAction(formData: FormData) {
  const ctx = await getServiceRoleIfAdmin();
  if (!ctx) {
    throw new Error("Unauthorized");
  }
  const rows = SOCIAL_PROFILES.map((profile, idx) => {
    const href = String(formData.get(`href__${profile.key}`) ?? "").trim();
    const isActive = formData.get(`active__${profile.key}`) === "on";
    const sortRaw = String(formData.get(`sort__${profile.key}`) ?? "").trim();
    const sortParsed = sortRaw.length > 0 ? Number(sortRaw) : idx;
    const sort_order = Number.isFinite(sortParsed) ? sortParsed : idx;
    return {
      key: profile.key,
      href,
      is_active: isActive,
      sort_order,
      updated_at: new Date().toISOString(),
    };
  }).filter((row) => SOCIAL_KEY_SET.has(row.key));

  const { error } = await ctx.db
    .from("site_social_links")
    .upsert(rows, { onConflict: "key" });
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath("/admin/social-links");
  revalidatePath("/", "layout");
}

export async function deleteProductReviewAction(formData: FormData) {
  const ctx = await getServiceRoleIfAdmin();
  if (!ctx) {
    throw new Error("Unauthorized");
  }
  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    throw new Error("Review id is required");
  }
  const { data: row, error: rowError } = await ctx.db
    .from("product_reviews")
    .select("product_id")
    .eq("id", id)
    .maybeSingle();
  if (rowError || !row?.product_id) {
    throw new Error("Review not found");
  }
  const { error } = await ctx.db.from("product_reviews").update({ is_deleted: true }).eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath("/admin/engagement");
  await revalidateProductStorefront(row.product_id);
}
