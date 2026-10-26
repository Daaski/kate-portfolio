import type { Metadata } from "next";
import { Inter } from "next/font/google";
import appleIcon from "@/assets/icons/apple-icon.png";
import favicon from "@/assets/icons/favicon.ico";
import iconSvg from "@/assets/icons/icon.svg";
import icon96 from "@/assets/icons/icon-96.png";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  description: "Портфолио Кати",
  // Иконки лежат в src/assets/icons, а не файлами-конвенциями в корне app,
  // чтобы app не засорялся
  icons: {
    apple: { sizes: "180x180", type: "image/png", url: appleIcon.src },
    icon: [
      { sizes: "16x16 32x32 48x48", type: "image/x-icon", url: favicon.src },
      { sizes: "any", type: "image/svg+xml", url: iconSvg.src },
      { sizes: "96x96", type: "image/png", url: icon96.src },
    ],
  },
  title: { default: "Катя — портфолио", template: "%s — Катя" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html className={`${inter.variable} antialiased`} lang="ru">
      <body className="bg-bg-page text-fg-primary">
        <div className="mx-auto box-content max-w-7xl px-4 lg:px-20">
          {children}
        </div>
      </body>
    </html>
  );
}
