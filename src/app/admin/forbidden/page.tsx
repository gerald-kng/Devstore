import Link from "next/link";

export default function AdminForbiddenPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-4 bg-zinc-950 px-6 py-20 text-center">
      <h1 className="text-lg font-medium text-amber-200">Access denied</h1>
      <p className="max-w-md text-sm text-zinc-500">
        This account is not in the <code>ADMIN_EMAILS</code> allowlist. Contact the site
        owner.
      </p>
      <Link
        href="/"
        className="text-sm font-medium text-emerald-400 hover:text-emerald-300"
      >
        Return home
      </Link>
    </div>
  );
}
