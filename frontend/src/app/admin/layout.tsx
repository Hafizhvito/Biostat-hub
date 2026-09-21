import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminRouteClient } from "@/components/layout/AdminRouteClient";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRouteLayout({ children }: { children: ReactNode }) {
  return <AdminRouteClient>{children}</AdminRouteClient>;
}
