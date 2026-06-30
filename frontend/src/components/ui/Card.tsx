/** Kartu konten dengan border halus. */

import { type HTMLAttributes, type ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-4 transition-colors duration-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
