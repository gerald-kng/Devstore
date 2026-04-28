import Link from "next/link";
import { StoreChrome } from "@/components/store-chrome";

export const dynamic = "force-dynamic";

export default function TermsPage() {
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
            Terms of Use
          </h1>
          <div className="mt-8 space-y-6 text-sm leading-relaxed text-zinc-300">
            <section>
              <h2 className="text-base font-semibold text-white">Acceptance of terms</h2>
              <p className="mt-2">
                By purchasing or using products from this store, you agree to these Terms of
                Use. If you do not agree, do not use the services.
              </p>
            </section>
            <section>
              <h2 className="text-base font-semibold text-white">License and usage</h2>
              <p className="mt-2">
                Products are licensed, not sold. Unless otherwise stated, your purchase grants
                a non-transferable license for personal or internal business use.
              </p>
            </section>
            <section>
              <h2 className="text-base font-semibold text-white">Payments and delivery</h2>
              <p className="mt-2">
                Payments are processed through supported providers. Download and installation
                access is provided after successful payment verification.
              </p>
            </section>
            <section>
              <h2 className="text-base font-semibold text-white">Refund policy</h2>
              <p className="mt-2">
                Due to the digital nature of products, refunds may be limited or unavailable
                after access is granted, except where required by law.
              </p>
            </section>
            <section>
              <h2 className="text-base font-semibold text-white">Liability disclaimer</h2>
              <p className="mt-2">
                Products are provided “as is” without warranties of any kind. To the maximum
                extent allowed by law, the store is not liable for indirect or consequential
                damages.
              </p>
            </section>
            <section>
              <h2 className="text-base font-semibold text-white">Contact</h2>
              <p className="mt-2">
                For questions about these terms, please use the{" "}
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
