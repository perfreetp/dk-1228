import { cn } from '@/lib/utils';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

const variantStyles = {
  primary: 'bg-gradient-to-r from-[#ff6b35] to-[#ff8c5a] text-white shadow-lg shadow-[#ff6b35]/20 hover:shadow-[#ff6b35]/40 hover:scale-[1.02]',
  secondary: 'bg-[#2a4a6a]/30 text-[#6a8aaa] border border-[#2a4a6a]/50 hover:bg-[#2a4a6a]/50 hover:text-white',
  ghost: 'bg-transparent text-[#6a8aaa] hover:bg-[#2a4a6a]/20 hover:text-white',
  danger: 'bg-gradient-to-r from-[#ff4757] to-[#ff6b6b] text-white shadow-lg shadow-[#ff4757]/20 hover:shadow-[#ff4757]/40',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
};

export default function Button({ children, variant = 'primary', size = 'md', onClick, disabled, className, icon }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {icon}
      {children}
    </button>
  );
}