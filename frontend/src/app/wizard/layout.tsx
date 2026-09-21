import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Wizard Pemilihan Uji Statistik",
  description: "Flowchart praktis untuk membantu memilih uji statistik berdasarkan jenis dan distribusi data.",
  alternates: { canonical: "/wizard" },
};

export default function Layout({ children }: { children: ReactNode }) { return children; }
