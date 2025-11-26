import React, { InputHTMLAttributes, SelectHTMLAttributes } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className, onClick }) => (
  <div onClick={onClick} className={cn("bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm", className)}>
    {children}
  </div>
);

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'danger' }> = ({ className, variant = 'primary', ...props }) => {
  const baseStyles = "flex items-center justify-center rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950";
  const variants = {
    primary: "bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-900/20 py-3.5 px-4 w-full",
    ghost: "bg-transparent hover:bg-slate-800 text-slate-400 hover:text-white p-2",
    danger: "bg-transparent hover:bg-red-900/30 text-slate-400 hover:text-red-400 p-2"
  };
  
  return (
    <button className={cn(baseStyles, variants[variant], className)} {...props} />
  );
};

export const Input: React.FC<InputHTMLAttributes<HTMLInputElement> & { label?: string, icon?: React.ReactNode }> = ({ label, icon, className, ...props }) => (
  <div className="flex flex-col gap-2 w-full">
    {label && <label className="text-slate-200 font-medium text-sm">{label}</label>}
    <div className="relative group">
      {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>}
      <input 
        className={cn(
          "w-full bg-slate-800 text-white rounded-xl border border-slate-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none py-3.5 transition-all placeholder:text-slate-500",
          icon ? "pl-10 pr-4" : "px-4",
          className
        )} 
        {...props} 
      />
    </div>
  </div>
);

export const Select: React.FC<SelectHTMLAttributes<HTMLSelectElement> & { label?: string }> = ({ label, className, children, ...props }) => (
  <div className="flex flex-col gap-2 w-full">
    {label && <label className="text-slate-200 font-medium text-sm">{label}</label>}
    <div className="relative">
      <select 
        className={cn(
          "w-full bg-slate-800 text-white rounded-xl border border-slate-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none py-3.5 px-4 appearance-none transition-all",
          className
        )} 
        {...props}
      >
        {children}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </div>
    </div>
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = "text-orange-500" }) => (
  <span className={cn("text-xs font-bold uppercase tracking-wider", color)}>
    {children}
  </span>
);
