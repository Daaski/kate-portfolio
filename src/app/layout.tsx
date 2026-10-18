import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  description: "Портфолио Кати",
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
