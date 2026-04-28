import { Play } from "lucide-react";
import type { DemoDisplay } from "@/lib/product-media";

type ProductDemoProps = {
  demo: DemoDisplay;
  productName: string;
};

export function ProductDemo({ demo, productName }: ProductDemoProps) {
  if (demo.kind === "iframe") {
    return (
      <iframe
        src={demo.src}
        title={`${productName} demo`}
        className="h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }
  if (demo.kind === "video") {
    return (
      <video
        className="h-full w-full object-contain"
        src={demo.src}
        controls
        playsInline
        preload="metadata"
      />
    );
  }
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-zinc-500">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5">
        <Play className="h-8 w-8 text-emerald-400" aria-hidden />
      </div>
      <p className="text-sm font-medium text-zinc-400">Demo video placeholder</p>
      <p className="max-w-xs px-6 text-center text-xs text-zinc-600">
        Add a demo in Admin: paste a YouTube or Vimeo link, or an https embed /
        direct video URL. You can also use a <code className="text-zinc-500">demo</code>{" "}
        row in <code className="text-zinc-500">product_videos</code> or a public file in{" "}
        <code className="text-zinc-500">product-images</code>.
      </p>
    </div>
  );
}
