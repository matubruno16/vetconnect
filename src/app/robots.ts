import type { MetadataRoute } from "next";

const BASE_URL = "https://vetconnect-tandil.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/search"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
