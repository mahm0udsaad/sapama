import type { MetadataRoute } from "next"
import { companyName, getSiteUrl, siteDescription } from "@/lib/seo"

export default function manifest(): MetadataRoute.Manifest {
  const siteUrl = getSiteUrl()

  return {
    name: companyName,
    short_name: companyName,
    description: siteDescription,
    start_url: siteUrl,
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#14215B",
    lang: "ar-SA",
    dir: "rtl",
    icons: [
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
