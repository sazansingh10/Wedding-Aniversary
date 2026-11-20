/**
 * Site-level configuration. No secrets live here; this file ships to the browser.
 * Set NEXT_PUBLIC_SITE_URL in your hosting provider to get absolute share URLs.
 */
const rawUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined);

export const siteConfig = {
  title: "Two Years. One Forever.",
  description: "A private anniversary letter, for Neela.",
  // Deliberately vague: link previews should not reveal personal details.
  shareDescription: "Something I made for you.",
  url: rawUrl,
  /**
   * SEO switch. false (default): search engines are asked not to list the site
   * (meta robots, X-Robots-Tag header, robots.txt) and the sitemap is empty.
   * true: the site becomes indexable and the sitemap lists it.
   * Her name, the photos and the letter would then be findable on Google.
   */
  indexable: false,
} as const;
