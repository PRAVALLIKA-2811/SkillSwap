import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  onClick,
  icon: Icon,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';

  const variants = {
    primary:
      'bg-brand-600 text-white hover:bg-brand-700 shadow-md shadow-brand-600/25 focus:ring-brand-500',
    secondary:
      'bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-200/80 focus:ring-brand-400',
    outline:
      'bg-transparent border-2 border-brand-600 text-brand-600 hover:bg-brand-50 focus:ring-brand-500',
    accent:
      'bg-accent-500 text-white hover:bg-accent-600 shadow-md shadow-accent-500/25 focus:ring-accent-400',
    ghost:
      'bg-transparent text-ink-secondary hover:text-ink-primary hover:bg-brand-50/80 focus:ring-brand-300',
    danger:
      'bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-500/20 focus:ring-rose-500',
    success:
      'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-500/20 focus:ring-emerald-500',
    gradient:
      'bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 text-white hover:brightness-105 shadow-lg shadow-brand-600/25',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
