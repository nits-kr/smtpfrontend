import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

const Input = forwardRef(({ label, error, className, ...props }, ref) => {
    return (
        <div className="w-full">
            {label && <label className="block text-sm font-medium text-slate-400 mb-1">{label}</label>}
            <input
                ref={ref}
                className={twMerge(
                    "w-full bg-slate-950 border rounded p-2 text-white focus:outline-none focus:ring-2 transition-all",
                    error ? "border-red-500 focus:ring-red-500/20" : "border-slate-700 focus:border-blue-500 focus:ring-blue-500/20",
                    className
                )}
                {...props}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
        </div>
    );
});

Input.displayName = "Input";
export default Input;
