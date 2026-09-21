import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Kuis Biostatistik",
  description: "Latihan soal untuk menguji pemahaman materi biostatistik, riset kesehatan, dan SPSS.",
  alternates: { canonical: "/kuis" },
};

export default function Layout({ children }: { children: ReactNode }) { return children; }
