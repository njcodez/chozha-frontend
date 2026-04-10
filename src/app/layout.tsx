import "@/styles/globals.css";

import { type Metadata } from "next";
import { Catamaran, Inter } from "next/font/google";

export const metadata: Metadata = {
  title: "Project Chozha",
  description: "Project - Choza an inscription binarization service",
  icons: [{ rel: "icon", url: "/icon.png" }],
};

const catamaran = Catamaran({
  subsets: ["latin", "tamil"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-catamaran",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${catamaran.variable} ${inter.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}