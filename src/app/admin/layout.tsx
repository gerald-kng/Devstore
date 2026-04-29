import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: { default: "Admin", template: "%s | Admin" },
};

/**
 * Child routes: `login` and `(panel)/*` each bring their own chrome.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
