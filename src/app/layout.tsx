import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Cormorant_Garamond, Manrope, Pinyon_Script } from "next/font/google";
import { siteConfig } from "@/config/site";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

// Only used for short handwritten moments, so it is never preloaded.
const pinyon = Pinyon_Script({
  variable: "--font-pinyon",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: siteConfig.url ? new URL(siteConfig.url) : undefined,
  title: siteConfig.title,
  description: siteConfig.description,
  applicationName: siteConfig.title,
  referrer: "no-referrer",
  // Private by default: never indexed, followed, cached or shown in image search.
  alternates: siteConfig.url ? { canonical: "/" } : undefined,
  robots: siteConfig.indexable
    ? { index: true, follow: true }
    : {
        index: false,
        follow: false,
        nocache: true,
        googleBot: { index: false, follow: false, noimageindex: true, "max-snippet": 0 },
      },
  openGraph: {
    type: "website",
    title: siteConfig.title,
    description: siteConfig.shareDescription,
    siteName: siteConfig.title,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.shareDescription,
  },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#160509",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${manrope.variable} ${pinyon.variable} antialiased`}
    >
      <body className="grain min-h-dvh">
        <noscript>
          {/* Without JS, skip the opening gate and show everything. */}
          <style>{`[data-gate]{display:none!important}[data-reveal],.paper *{opacity:1!important;transform:none!important;filter:none!important}`}</style>
        </noscript>
        {children}
        {/* Cookie-less visit counts, served from this site's own domain (/_vercel/insights). */}
        <Analytics />
      </body>
    </html>
  );
}
