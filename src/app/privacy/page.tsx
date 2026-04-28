import Link from "next/link";
import { StoreChrome } from "@/components/store-chrome";

export const dynamic = "force-dynamic";

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <div className="mt-8 space-y-6 text-sm leading-relaxed text-zinc-300">
            <section>
              <h2 className="text-base font-semibold text-white">Information we collect</h2>
              <p className="mt-2">
                We collect information required to process purchases and support requests, such
                as email address, order metadata, and messages you submit through forms.
              </p>
            </section>
            <section>
              <h2 className="text-base font-semibold text-white">How we use information</h2>
              <p className="mt-2">
                We use collected data to process payments, deliver purchased products, respond
                to support inquiries, and improve service reliability and security.
              </p>
            </section>
            <section>
              <h2 className="text-base font-semibold text-white">Third-party services</h2>
              <p className="mt-2">
                We rely on third-party providers (for example payment processors and hosting
                vendors). Their handling of data is governed by their own policies.
              </p>
            </section>
            <section>
              <h2 className="text-base font-semibold text-white">Data retention</h2>
              <p className="mt-2">
                We retain order and support records for operational, legal, and fraud-prevention
                purposes for as long as reasonably necessary.
              </p>
            </section>
            <section>
              <h2 className="text-base font-semibold text-white">Security</h2>
              <p className="mt-2">
                We apply reasonable technical and organizational safeguards, but no system can
                guarantee absolute security.
              </p>
            </section>
            <section>
              <h2 className="text-base font-semibold text-white">Contact</h2>
              <p className="mt-2">
                To request access, correction, or deletion of your personal data, please use
                our{" "}
                <Link href="/contact" className="text-emerald-400 hover:text-emerald-300">
                  Contact page
                </Link>
                .
              </p>
            </section>
          </div>
        </main>
      </div>
    </StoreChrome>
  );
}
