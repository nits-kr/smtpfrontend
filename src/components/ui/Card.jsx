import React from 'react';
import { twMerge } from 'tailwind-merge';

const Card = ({ children, className, title, actions }) => {
    return (
        <div className={twMerge("bg-slate-800 rounded-lg shadow-md border border-slate-700 overflow-hidden", className)}>
            {(title || actions) && (
                <div className="px-6 py-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                    {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
                    {actions && <div>{actions}</div>}
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
};

export default Card;
