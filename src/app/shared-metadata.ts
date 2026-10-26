import type { Metadata } from "next";
import { site } from "@/constants/site";

// Metadata сегментов сливается поверхностно: openGraph страницы целиком заменяет
// openGraph из layout, поэтому каждая страница подмешивает общие поля сама.
export const openGraph = {
  locale: "ru_RU",
  siteName: site.name,
  type: "website",
} satisfies Metadata["openGraph"];
