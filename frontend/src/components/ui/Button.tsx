/** Tombol reusable (primary / secondary / danger). */

import { type ButtonHTMLAttributes, type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-brand-warm text-white hover:bg-brand-warm/90",
  secondary:
    "border border-brand-warm bg-white text-brand-warm hover:bg-brand-peach",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

export function Button({
  children,
  onClick,
  type = "button",
  disabled = false,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-warm focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
