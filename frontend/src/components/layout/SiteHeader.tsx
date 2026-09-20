/** Header navigasi situs publik. Ganti design: comment/uncomment block + ubah return di SiteHeader. */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Menu, X } from "lucide-react";

function isPublicPath(pathname: string) {
  return !pathname.startsWith("/admin");
}

function navLinkClass(active: boolean, design: 1 | 2 | 3, mobile = false) {
  if (design === 1) {
    const base = mobile
      ? "block w-full rounded-md px-4 py-3 text-base font-medium"
      : "rounded-md px-3 py-2 text-sm font-medium";
    return active
      ? `${base} bg-brand-peach text-brand-warm`
      : `${base} text-brand-navy transition-colors hover:bg-brand-peach/70`;
  }
  if (design === 3) {
    const base = mobile
      ? "block w-full px-4 py-3 text-base font-medium"
      : "px-1 pb-0.5 text-sm font-medium";
    return active
      ? `${base} ${mobile ? "text-d3-coral" : "border-b-2 border-d3-coral text-d3-coral"}`
      : `${base} ${mobile ? "text-d3-sand/90 hover:text-white" : "text-d3-sand/80 transition-colors hover:text-white"}`;
  }
  const base = mobile
    ? "block w-full px-4 py-3 text-base font-medium"
    : "px-1 pb-0.5 text-sm font-medium";
  return active
    ? `${base} ${mobile ? "text-d2-blue" : "border-b-2 border-d2-blue text-d2-blue"}`
    : `${base} text-gray-500 transition-colors hover:text-d2-blue`;
}

type NavItem = {
  href: string;
  label: string;
  isActive: (pathname: string) => boolean;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Beranda", isActive: (pathname) => pathname === "/" },
  {
    href: "/#jelajahi-materi",
    label: "Materi",
    isActive: (pathname) => pathname.startsWith("/section/"),
  },
  {
    href: "/kuis",
    label: "Kuis",
    isActive: (pathname) => pathname === "/kuis" || pathname.startsWith("/quiz/"),
  },
  { href: "/glosarium", label: "Glosarium", isActive: (pathname) => pathname === "/glosarium" },
  { href: "/unduhan", label: "Unduhan", isActive: (pathname) => pathname === "/unduhan" },
];

/* ==========================================================================
 * DESIGN 1 (aktif)
 * ========================================================================== */
function SiteHeaderDesign1() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="border-b border-brand-powder/80 bg-white shadow-sm">
      <div className="site-container">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="inline-flex min-w-0 items-center gap-2 text-lg font-bold text-brand-navy">
            <GraduationCap className="h-5 w-5 shrink-0 text-brand-warm" />
            <span className="truncate">Riset Hub</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Navigasi utama">
            {NAV_ITEMS.map(({ href, label, isActive }) => (
              href.includes("#") ? (
                <a key={href} href={href} className={navLinkClass(isActive(pathname), 1)}>
                  {label}
                </a>
              ) : (
                <Link key={href} href={href} className={navLinkClass(isActive(pathname), 1)}>
                  {label}
                </Link>
              )
            ))}
          </nav>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-brand-navy md:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileOpen ? (
          <nav
            id="mobile-nav"
            className="flex flex-col gap-1 border-t border-brand-powder/80 pb-4 pt-2 md:hidden"
            aria-label="Navigasi mobile"
          >
            {NAV_ITEMS.map(({ href, label, isActive }) => (
              href.includes("#") ? (
                <a
                  key={href}
                  href={href}
                  className={navLinkClass(isActive(pathname), 1, true)}
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </a>
              ) : (
                <Link
                  key={href}
                  href={href}
                  className={navLinkClass(isActive(pathname), 1, true)}
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </Link>
              )
            ))}
          </nav>
        ) : null}
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
      <div className="site-container flex items-center justify-between py-4">
        <Link href="/" className="inline-flex items-center gap-2 text-lg font-bold text-gray-900">
          <BarChart3 className="h-6 w-6 text-d2-blue" strokeWidth={2.25} />
          <span>Riset Hub</span>
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
      <div className="site-container flex items-center justify-between py-4">
        <Link href="/" className="inline-flex items-center gap-2 text-lg font-bold">
          <BookOpen className="h-5 w-5 text-d3-coral" />
          <span>Riset Hub</span>
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
