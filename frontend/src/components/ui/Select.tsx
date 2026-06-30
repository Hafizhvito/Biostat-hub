/** Dropdown select + label. */

import { type SelectHTMLAttributes } from "react";

type SelectOption = {
  value: string;
  label: string;
};

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
}

export function Select({
  id,
  label,
  options,
  error,
  className = "",
  placeholder,
  ...props
}: SelectProps) {
  const fieldId = id ?? `select-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="space-y-1.5">
      <label htmlFor={fieldId} className="text-sm font-medium text-brand-navy">
        {label}
      </label>
      <select
        id={fieldId}
        className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-800 outline-none transition-colors focus:border-brand-teal focus:ring-2 focus:ring-brand-teal-soft ${
          error ? "border-red-500" : "border-gray-300"
        } ${className}`}
        {...props}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
