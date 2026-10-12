import type { MetadataRoute } from "next"
import { companyName, siteDescription } from "@/lib/seo"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: companyName,
    short_name: companyName,
    description: siteDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#14215B",
    lang: "ar-SA",
    dir: "rtl",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
