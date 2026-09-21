"use client";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { getToken } from "@/lib/auth";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useMemo, useState } from "react";

export function AdminRouteClient({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const isLoginPage = useMemo(() => pathname === "/admin/login", [pathname]);

  useEffect(() => {
    if (isLoginPage) {
      setIsCheckingAuth(false);
      return;
    }
    const token = getToken();
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    setIsCheckingAuth(false);
  }, [isLoginPage, router]);

  if (isLoginPage) return <>{children}</>;
  if (isCheckingAuth) return <p className="py-8 text-center text-sm text-gray-500">Loading...</p>;
  return <AdminLayout>{children}</AdminLayout>;
}
