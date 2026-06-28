import React, { forwardRef } from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  children?: React.ReactNode;
  id: string;
  mask?: (value: string) => string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, children, id, mask, onChange, ...props }, ref) => {

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (mask) {
        e.target.value = mask(e.target.value);
      }

      if (onChange) {
        onChange(e);
      }
    };

    return (
      <div className="flex flex-col gap-2 w-full">
        <label htmlFor={id} className="ml-1 text-sm font-semibold text-zinc-900 transition-colors duration-300">
          {label}
        </label>
        <div className="relative">
          {children}

          <input
            id={id}
            ref={ref}
            onChange={handleInputChange}
            {...props}
            className="
              w-full pl-12 pr-4 py-3 rounded-lg text-sm transition-all duration-300
              bg-zinc-50
              border border-zinc-200 
              text-zinc-900
              placeholder:text-zinc-400 
              focus:outline-none focus:ring-2 focus:ring-zinc-900
              
              [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_var(--color-zinc-50)] 
              [&:-webkit-autofill]:[-webkit-text-fill-color:var(--color-zinc-900)]
            "
          />
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
