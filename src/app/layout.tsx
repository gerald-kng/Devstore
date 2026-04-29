import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@/components/analytics";
import { JsonLd } from "@/components/json-ld";
import { RevealObserver } from "@/components/reveal-observer";
import { buildRootMetadata, organizationLd, websiteLd } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = buildRootMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var t = localStorage.getItem("theme");
                  if (t !== "dark" && t !== "light") {
                    t = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
                  }
                  document.documentElement.setAttribute("data-theme", t);
                } catch (_) {}
              })();
            `,
          }}
        />
        <JsonLd id="ld-organization" data={organizationLd()} />
        <JsonLd id="ld-website" data={websiteLd()} />
        {children}
        <RevealObserver />
        <Analytics />
      </body>
    </html>
  );
}
