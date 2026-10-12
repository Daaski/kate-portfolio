import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "@/styles/globals.css";

const geistSans = Geist({
  subsets: ["latin", "cyrillic"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  description: "Портфолио Кати",
  title: "Катя — портфолио",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html className={`${geistSans.variable} antialiased`} lang="ru">
      <body className="bg-background text-foreground">{children}</body>
    </html>
  );
}
