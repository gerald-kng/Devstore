import Link from "next/link";
import { Mail, MessageSquare } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { StoreChrome } from "@/components/store-chrome";

export const dynamic = "force-dynamic";

function getSupportEmail(): string {
  const fromAdmin = process.env.ADMIN_EMAILS?.split(",")
    .map((s) => s.trim())
    .find((s) => s.length > 0);
  return fromAdmin ?? "support@example.com";
}

export default function ContactPage() {
  const supportEmail = getSupportEmail();

  return (
    <StoreChrome>
      <div className="relative flex min-h-full flex-1 flex-col overflow-hidden bg-zinc-950 text-zinc-50">
        <div className="pointer-events-none absolute inset-0 opacity-80" aria-hidden>
          <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl" />
        </div>

        <main className="relative z-10 mx-auto w-full max-w-3xl flex-1 px-6 py-14">
          <Link href="/" className="text-sm text-emerald-400 hover:text-emerald-300">
            ← Back to store
          </Link>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Contact
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-zinc-400">
            Need help with a purchase, download access, or product question? Reach out and
            we will get back to you as soon as possible.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <ContactForm />

            <a
              href={`mailto:${supportEmail}`}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-emerald-500/30"
            >
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-emerald-400" aria-hidden />
                <p className="text-sm font-medium text-white">Email support</p>
              </div>
              <p className="mt-2 break-all text-sm text-zinc-400">{supportEmail}</p>
            </a>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-emerald-400" aria-hidden />
                <p className="text-sm font-medium text-white">What to include</p>
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-400">
                <li>Your order ID</li>
                <li>The product name/slug</li>
                <li>A short description of the issue</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </StoreChrome>
  );
}
