import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

/**
 * A private anniversary page: ask all crawlers to stay out.
 * (The X-Robots-Tag header and meta robots tag also say noindex, for crawlers
 * that reach the page through a shared link anyway.) No sitemap on purpose.
 */
export default function robots(): MetadataRoute.Robots {
  if (siteConfig.indexable) {
    return {
      rules: [{ userAgent: "*", allow: "/" }],
      sitemap: siteConfig.url ? `${siteConfig.url}/sitemap.xml` : undefined,
    };
  }
  return { rules: [{ userAgent: "*", disallow: "/" }] };
}
