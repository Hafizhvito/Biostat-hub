/** Header navigasi situs publik. Ganti design: comment/uncomment block + ubah return di SiteHeader. */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BookOpen, GraduationCap } from "lucide-react";

function isPublicPath(pathname: string) {
  return !pathname.startsWith("/admin");
}

function navLinkClass(active: boolean, design: 1 | 2 | 3) {
  if (design === 1) {
    return active
      ? "rounded-md bg-brand-peach px-3 py-2 text-sm font-medium text-brand-warm"
      : "rounded-md px-3 py-2 text-sm font-medium text-brand-navy transition-colors hover:bg-brand-peach/70";
  }
  if (design === 3) {
    return active
      ? "border-b-2 border-d3-coral px-1 pb-0.5 text-sm font-medium text-d3-coral"
      : "px-1 pb-0.5 text-sm font-medium text-d3-sand/80 transition-colors hover:text-white";
  }
  return active
    ? "border-b-2 border-d2-blue px-1 pb-0.5 text-sm font-medium text-d2-blue"
    : "px-1 pb-0.5 text-sm font-medium text-gray-500 transition-colors hover:text-d2-blue";
}

/* ==========================================================================
 * DESIGN 1 (aktif)
 * ========================================================================== */
function SiteHeaderDesign1() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isKuis = pathname === "/kuis" || pathname.startsWith("/quiz/");

  return (
    <header className="border-b border-brand-powder/80 bg-white shadow-sm">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="inline-flex items-center gap-2 text-lg font-bold text-brand-navy">
          <GraduationCap className="h-5 w-5 text-brand-warm" />
          <span>Biostat Hub</span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link href="/" className={navLinkClass(isHome, 1)}>
            Beranda
          </Link>
          <Link href="/kuis" className={navLinkClass(isKuis, 1)}>
            Kuis
          </Link>
        </nav>
      </div>
    </header>
  );
}

/* ==========================================================================
 * DESIGN 2 — header putih minimal
 * ==========================================================================
function SiteHeaderDesign2() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isKuis = pathname === "/kuis" || pathname.startsWith("/quiz/");

  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="inline-flex items-center gap-2 text-lg font-bold text-gray-900">
          <BarChart3 className="h-6 w-6 text-d2-blue" strokeWidth={2.25} />
          <span>Biostat Hub</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/" className={navLinkClass(isHome, 2)}>
            Beranda
          </Link>
          <Link href="/kuis" className={navLinkClass(isKuis, 2)}>
            Kuis
          </Link>
        </nav>
      </div>
    </header>
  );
}
*/

/* ==========================================================================
 * DESIGN 3 — header plum gelap
 * ==========================================================================
function SiteHeaderDesign3() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isKuis = pathname === "/kuis" || pathname.startsWith("/quiz/");

  return (
    <header className="bg-d3-plum-dark text-white shadow-sm">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="inline-flex items-center gap-2 text-lg font-bold">
          <BookOpen className="h-5 w-5 text-d3-coral" />
          <span>Biostat Hub</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/" className={navLinkClass(isHome, 3)}>
            Beranda
          </Link>
          <Link href="/kuis" className={navLinkClass(isKuis, 3)}>
            Kuis
          </Link>
        </nav>
      </div>
    </header>
  );
}
*/

export function SiteHeader() {
  const pathname = usePathname();

  if (!isPublicPath(pathname)) {
    return null;
  }

  return <SiteHeaderDesign1 />;
  // return <SiteHeaderDesign2 />;
  // return <SiteHeaderDesign3 />;
}
