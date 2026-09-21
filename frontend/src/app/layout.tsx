/** Layout global: header + footer. Design 3 butuh Design3LayoutEffect (lihat block comment). */

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://biostatresearch.com"),
  title: {
    default: "Riset Hub — Pembelajaran Biostatistik dan SPSS",
    template: "%s | Riset Hub",
  },
  description:
    "Platform pembelajaran mandiri biostatistik, riset kesehatan, pemilihan uji statistik, dan pengolahan data dengan SPSS.",
  applicationName: "Riset Hub",
  authors: [{ name: "Riset Hub" }],
  creator: "Riset Hub",
  publisher: "Riset Hub",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Riset Hub",
    title: "Riset Hub — Pembelajaran Biostatistik dan SPSS",
    description:
      "Pelajari biostatistik, riset kesehatan, pemilihan uji statistik, dan pengolahan data dengan SPSS.",
    url: "/",
    images: [{ url: "/icon.png", width: 512, height: 512, alt: "Logo Riset Hub" }],
  },
  twitter: {
    card: "summary",
    title: "Riset Hub — Pembelajaran Biostatistik dan SPSS",
    description:
      "Pelajari biostatistik, riset kesehatan, pemilihan uji statistik, dan pengolahan data dengan SPSS.",
    images: ["/icon.png"],
  },
  verification: {
    google: "ZXbGNsTF4SrNHc4zlUlzJotxy1iB0ckjqoNDET9jpxw",
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
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
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
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
