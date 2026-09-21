import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/search"],
    },
    sitemap: "https://biostatresearch.com/sitemap.xml",
    host: "https://biostatresearch.com",
  };
}
