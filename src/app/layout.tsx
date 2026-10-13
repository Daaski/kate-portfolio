import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  description: "Портфолио Кати",
  title: "Катя — портфолио",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html className={`${inter.variable} antialiased`} lang="ru">
      <body className="bg-bg-page text-fg-primary">{children}</body>
    </html>
  );
}
