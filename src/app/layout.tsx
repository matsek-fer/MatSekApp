import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  title: "MATSEK — Matematička sekcija FER",
  description: "Službena aplikacija za upravljanje aktivnostima Math Cluba FER",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
