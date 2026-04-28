import type { ReactNode } from "react";

/**
 * Child routes: `login` and `(panel)/*` each bring their own chrome.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
