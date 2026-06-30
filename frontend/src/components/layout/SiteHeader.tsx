/** Header navigasi situs publik. */

import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="bg-brand-navy text-white shadow-sm">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="inline-flex items-center gap-2 text-lg font-bold">
          <GraduationCap className="h-5 w-5 text-brand-mint" />
          <span>Biostat Hub</span>
        </Link>
        <nav>
          <Link
            href="/"
            className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-brand-teal/40"
          >
            Beranda
          </Link>
        </nav>
      </div>
    </header>
  );
}
