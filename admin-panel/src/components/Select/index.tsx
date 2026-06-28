import React, { forwardRef } from 'react';
import { t } from 'i18next';

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'id'> {
  label: string;
  id: string;
  options: string[];
  translationGroup: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, id, options, translationGroup, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        <label htmlFor={id} className="ml-1 text-sm font-semibold text-zinc-900 transition-colors duration-300">
          {label}
        </label>
        <select
          id={id}
          ref={ref} // O Hook Form assume o controle aqui
          {...props} // Injeta name, onChange, onBlur, disabled, etc.
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
);

Select.displayName = 'Select';

export default Select;
