/** Footer situs publik. Ganti design: comment/uncomment block + ubah return di SiteFooter. */

"use client";

import { usePathname } from "next/navigation";
import { BookOpen, GraduationCap } from "lucide-react";

function isPublicPath(pathname: string) {
  return !pathname.startsWith("/admin");
}

/* ==========================================================================
 * DESIGN 1 (aktif)
 * ========================================================================== */
function SiteFooterDesign1() {
  return (
    <footer className="border-t border-brand-teal/20 bg-brand-bg-light">
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <p className="flex items-center justify-center gap-2 text-center text-sm text-gray-600">
          <GraduationCap className="h-4 w-4 shrink-0 text-brand-teal" />
          Materi disusun ringkas, terstruktur, dan mudah dipahami.
        </p>
        <p className="mt-4 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} FK YARSI - Biostat Hub
        </p>
      </div>
    </footer>
  );
}

/* ==========================================================================
 * DESIGN 2 — footer putih + tagline biru
 * ==========================================================================
function SiteFooterDesign2() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <p className="flex items-center justify-center gap-2 text-center text-sm text-gray-500">
          <GraduationCap className="h-4 w-4 shrink-0 text-d2-blue" />
          Materi disusun ringkas, terstruktur, dan mudah dipahami.
        </p>
        <p className="mt-4 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} FK YARSI - Biostat Hub
        </p>
      </div>
    </footer>
  );
}
*/

/* ==========================================================================
 * DESIGN 3 — footer sand + plum
 * ==========================================================================
function SiteFooterDesign3() {
  return (
    <footer className="border-t border-d3-plum/15 bg-d3-sand">
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <p className="flex items-center justify-center gap-2 text-center text-sm text-d3-muted">
          <BookOpen className="h-4 w-4 shrink-0 text-d3-coral" />
          Materi disusun ringkas, terstruktur, dan mudah dipahami.
        </p>
        <p className="mt-4 text-center text-xs text-d3-muted/70">
          © {new Date().getFullYear()} FK YARSI - Biostat Hub
        </p>
      </div>
    </footer>
  );
}
*/

export function SiteFooter() {
  const pathname = usePathname();

  if (!isPublicPath(pathname)) {
    return null;
  }

  return <SiteFooterDesign1 />;
  // return <SiteFooterDesign2 />;
  // return <SiteFooterDesign3 />;
}
