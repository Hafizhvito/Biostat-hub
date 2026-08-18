/** Layout global: header + footer. Design 3 butuh Design3LayoutEffect (lihat block comment). */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Riset Hub",
  description: "Portal pembelajaran riset dan SPSS",
};

/* ==========================================================================
 * DESIGN 1 & 2 (aktif)
 * ========================================================================== */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="site-container flex-1 py-6">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

/* ==========================================================================
 * DESIGN 3 — uncomment block ini & comment block DESIGN 1&2 di atas
 * ==========================================================================
import { Design3LayoutEffect } from "@/components/layout/Design3LayoutEffect";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Design3LayoutEffect />
        <SiteHeader />
        <main className="site-container flex flex-1 flex-col py-6">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
*/
