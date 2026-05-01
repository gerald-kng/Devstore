"use client";

import { useState } from "react";
import { Upload } from "lucide-react";

type AdminFileUploadProps = {
  label: string;
  bucket: "product-images" | "downloads";
  /** Optional; reserved for form fields that mirror the uploaded path. */
  fieldName?: "main_image_path" | "app_storage_path" | "video_storage_path";
  prefix: string;
  onPath: (path: string) => void;
  accept?: string;
};

export function AdminFileUpload({
  label,
  bucket,
  fieldName: _fieldName,
  prefix,
  onPath,
  accept,
}: AdminFileUploadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) {
      return;
    }
    setError(null);
    setLoading(true);
    try {
      // `downloads` goes through our API so large app zips/videos are uploaded
      // server-side to R2/Supabase. Direct browser PUT to R2 fails without S3 CORS ("Load failed").
      if (bucket === "downloads") {
        const formData = new FormData();
        formData.append("file", f);
        formData.append("bucket", bucket);
        formData.append("prefix", prefix);
        const uploadRes = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        const uploadJson = (await uploadRes.json()) as { path?: string; error?: string };
        if (!uploadRes.ok || !uploadJson.path) {
          throw new Error(uploadJson.error ?? "Upload failed");
        }
        onPath(uploadJson.path);
        return;
      }

      const signRes = await fetch("/api/admin/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bucket,
          prefix,
          filename: f.name,
          contentType: f.type || "application/octet-stream",
          upsert: true,
        }),
      });
      const signJson = (await signRes.json()) as {
        path?: string;
        token?: string;
        signedUrl?: string;
        uploadHeaders?: Record<string, string>;
        error?: string;
      };
      if (!signRes.ok || !signJson.path || !signJson.signedUrl) {
        throw new Error(signJson.error ?? "Could not initialize upload");
      }

      const uploadResponse = await fetch(signJson.signedUrl, {
        method: "PUT",
        body: f,
        headers: signJson.uploadHeaders ?? {
          "content-type": f.type || "application/octet-stream",
          "x-upsert": "true",
        },
      });
      if (!uploadResponse.ok) {
        const bodyText = await uploadResponse.text();
        throw new Error(
          `Upload failed (${uploadResponse.status}): ${
            bodyText || uploadResponse.statusText
          }`,
        );
      }

      onPath(signJson.path);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-zinc-400">
        {label} · {bucket}
      </label>
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 hover:border-emerald-600/50">
        <Upload className="h-4 w-4" />
        {loading ? "Uploading…" : "Choose file…"}
        <input
          type="file"
          className="hidden"
          onChange={onFile}
          accept={accept}
          disabled={loading}
        />
      </label>
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  );
}
