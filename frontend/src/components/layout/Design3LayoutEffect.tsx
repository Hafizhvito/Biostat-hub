/** Set class `design-3` pada body untuk background sand penuh (tanpa gap putih). */

"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

function isPublicPath(pathname: string) {
  return !pathname.startsWith("/admin");
}

export function Design3LayoutEffect() {
  const pathname = usePathname();

  useEffect(() => {
    const enabled = isPublicPath(pathname);
    document.body.classList.toggle("design-3", enabled);
    return () => document.body.classList.remove("design-3");
  }, [pathname]);

  return null;
}
