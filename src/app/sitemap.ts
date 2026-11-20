import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

/** Lists the page only when the site is switched to indexable (see config/site.ts). */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteConfig.indexable || !siteConfig.url) return [];
  return [{ url: siteConfig.url, changeFrequency: "yearly", priority: 1 }];
}
