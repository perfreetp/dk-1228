import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'search';
  className?: string;
  icon?: React.ReactNode;
}

export default function Input({ value, onChange, placeholder, type = 'text', className, icon }: InputProps) {
  return (
    <div className={cn('relative', className)}>
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6a8aaa]">
          {icon}
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full bg-[#2a4a6a]/20 border border-[#2a4a6a]/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#6a8aaa] focus:outline-none focus:border-[#ff6b35]/50 focus:bg-[#2a4a6a]/30 transition-all',
          icon && 'pl-10'
        )}
      />
    </div>
  );
}