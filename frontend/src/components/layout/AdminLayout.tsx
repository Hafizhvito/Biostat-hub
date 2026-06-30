/** Sidebar/menu admin: Materi, Video, Kuis, Pengaturan. */

import Link from "next/link";
import { BookOpen, LayoutDashboard, Settings, Video } from "lucide-react";
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
];

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 md:flex-row md:gap-6">
      <aside className="w-full rounded-xl border border-brand-teal-soft bg-white p-4 md:w-64 md:self-start">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-navy">
          Menu Admin
        </p>
        <nav className="flex flex-col gap-2">
          {adminLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-brand-teal-soft hover:text-brand-teal"
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
