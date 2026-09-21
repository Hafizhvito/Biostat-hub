import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Glosarium Biostatistik",
  description: "Kamus istilah biostatistik dan penelitian kesehatan yang dapat dicari dengan cepat.",
  alternates: { canonical: "/glosarium" },
};

export default function Layout({ children }: { children: ReactNode }) { return children; }
