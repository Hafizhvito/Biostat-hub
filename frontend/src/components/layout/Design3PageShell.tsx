/** Wrapper full-bleed Design 3 — mengisi tinggi main (flex-1) agar tidak ada gap putih. */

import type { ReactNode } from "react";

interface Design3PageShellProps {
  children: ReactNode;
  className?: string;
}

export function Design3PageShell({ children, className = "" }: Design3PageShellProps) {
  return (
    <div
      className={`relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] flex w-screen flex-1 flex-col bg-d3-sand ${className}`}
    >
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</div>
    </div>
  );
}
