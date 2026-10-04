import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'live' | 'neutral' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
  withDot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  withDot = false,
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 font-medium rounded',
    md: 'text-xs px-2.5 py-1 font-medium rounded-md',
  };

  const variantClasses = {
    default: 'bg-indigo-50 text-indigo-700 border border-indigo-100',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    warning: 'bg-amber-50 text-amber-800 border border-amber-100',
    error: 'bg-rose-50 text-rose-700 border border-rose-100',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
    outline: 'border border-slate-300 text-slate-700 bg-transparent',
    live: 'bg-rose-600 text-white font-semibold shadow-sm shadow-rose-500/30',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>
      {withDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            variant === 'live'
              ? 'bg-white animate-pulse'
              : variant === 'success'
              ? 'bg-emerald-500'
              : variant === 'warning'
              ? 'bg-amber-500'
              : variant === 'error'
              ? 'bg-rose-500'
              : 'bg-indigo-500'
          }`}
        />
      )}
      {children}
    </span>
  );
};
