/** Input teks + label + pesan error. */

import { type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({
  id,
  label,
  error,
  className = "",
  ...props
}: InputProps) {
  const fieldId = id ?? `input-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="space-y-1.5">
      <label htmlFor={fieldId} className="text-sm font-medium text-brand-navy">
        {label}
      </label>
      <input
        id={fieldId}
        className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal-soft ${
          error ? "border-red-500" : "border-gray-300"
        } ${className}`}
        {...props}
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
