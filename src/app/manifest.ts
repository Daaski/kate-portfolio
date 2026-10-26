import type { MetadataRoute } from "next";
import manifest192 from "@/assets/icons/manifest-192.png";
import manifest512 from "@/assets/icons/manifest-512.png";

// output: "export" без этого не соберёт metadata route
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: "#ffffff",
    display: "standalone",
    // Без иконок с purpose "any" (значение по умолчанию) Chrome не даёт установить
    // сайт; maskable с полями безопасной зоны — для адаптивных иконок Android
    icons: [
      { sizes: "192x192", src: manifest192.src, type: "image/png" },
      { sizes: "512x512", src: manifest512.src, type: "image/png" },
      {
        purpose: "maskable",
        sizes: "192x192",
        src: manifest192.src,
        type: "image/png",
      },
      {
        purpose: "maskable",
        sizes: "512x512",
        src: manifest512.src,
        type: "image/png",
      },
    ],
    name: "Kate Nemova - UX/UI Designer",
    // Относительно адреса манифеста: даёт корень сайта с basePath. Без них браузер
    // берёт страницу, с которой поставили сайт, — например, страницу кейса
    scope: "./",
    short_name: "knnemova",
    start_url: "./",
    theme_color: "#ffffff",
  };
}
