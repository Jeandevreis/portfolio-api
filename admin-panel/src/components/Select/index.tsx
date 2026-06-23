import React from 'react';
import { t } from 'i18next';

interface SelectProps {
  label: string;
  id?: string;
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  translationGroup: string;
  required?: boolean;
  disabled?: boolean;
}

export default function Select({
  label,
  id,
  name,
  value,
  onChange,
  options,
  translationGroup,
  required,
  disabled
}: SelectProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label htmlFor={id} className="ml-1 text-sm font-semibold text-zinc-900 transition-colors duration-300">
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="
          w-full px-4 py-3 rounded-lg text-sm transition-all duration-300
          bg-zinc-50 border border-zinc-200 text-zinc-900 
          focus:outline-none focus:ring-2 focus:ring-zinc-900 
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {t(`${translationGroup}.${opt}`)}
          </option>
        ))}
      </select>
    </div>
  );
}
