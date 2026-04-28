"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type HeaderItem = {
  slug: string;
  title: string;
  nav_label: string | null;
};

function baseClass(active: boolean): string {
  return active
    ? "text-emerald-400"
    : "text-zinc-500 hover:text-emerald-400";
}

export function StoreNavLinks({ headerItems }: { headerItems: HeaderItem[] }) {
  const pathname = usePathname();
  const isProducts =
    pathname === "/products" || pathname?.startsWith("/products/") || pathname === "/courses";

  return (
    <>
      <Link href="/" className={baseClass(pathname === "/")}>
        Home
      </Link>
      <Link href="/products" className={baseClass(isProducts)}>
        Products
      </Link>
      <Link href="/courses" className={baseClass(pathname === "/courses")}>
        Courses
      </Link>
      {headerItems.map((p) => {
        const href = `/c/${p.slug}`;
        return (
          <Link key={p.slug} href={href} className={baseClass(pathname === href)}>
            {p.nav_label || p.title}
          </Link>
        );
      })}
    </>
  );
}
