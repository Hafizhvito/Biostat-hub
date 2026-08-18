/** Sidebar/menu admin: Materi, Video, Kuis, Pengaturan. */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Calculator, Download, LayoutDashboard, LibraryBig, Settings, Video, Workflow } from "lucide-react";
import { type ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

const adminLinks = [
  {
    href: "/admin/sections",
    label: "Kelola Materi",
    icon: BookOpen,
  },
  {
    href: "/admin/videos",
    label: "Kelola Video",
    icon: Video,
  },
  {
    href: "/admin/quizzes",
    label: "Kelola Kuis",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/settings",
    label: "Pengaturan Beranda",
    icon: Settings,
  },
  {
    href: "/admin/downloads",
    label: "Kelola Unduhan",
    icon: Download,
  },
  {
    href: "/admin/wizard",
    label: "Kelola Wizard Uji",
    icon: Workflow,
  },
  {
    href: "/admin/glossary",
    label: "Kelola Glosarium",
    icon: LibraryBig,
  },
  {
    href: "/admin/tools",
    label: "Pengaturan Alat",
    icon: Calculator,
  },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="site-container flex flex-col gap-4 py-6 md:flex-row md:gap-6">
      <aside className="w-full rounded-xl border border-brand-teal-soft bg-white p-4 md:w-64 md:self-start">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-navy">
          Menu Admin
        </p>
        <nav className="flex flex-col gap-2">
          {adminLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand-warm/10 text-brand-warm"
                    : "text-gray-700 hover:bg-brand-teal-soft hover:text-brand-teal"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
