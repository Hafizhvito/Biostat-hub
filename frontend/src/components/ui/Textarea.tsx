/** Textarea + label + pesan error. */

import { type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function Textarea({
  id,
  label,
  error,
  className = "",
  rows = 4,
  ...props
}: TextareaProps) {
  const fieldId = id ?? `textarea-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="space-y-1.5">
      <label htmlFor={fieldId} className="text-sm font-medium text-brand-navy">
        {label}
      </label>
      <textarea
        id={fieldId}
        rows={rows}
        className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal-soft ${
          error ? "border-red-500" : "border-gray-300"
        } ${className}`}
        {...props}
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
