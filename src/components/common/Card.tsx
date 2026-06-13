import { cn } from '@/lib/utils';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export default function Card({ title, subtitle, children, className, action }: CardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a2d4a]/80 to-[#0f1a2d]/60 border border-[#2a4a6a]/30 backdrop-blur-xl p-6 transition-all duration-300 hover:border-[#3a6a9f]/50',
        className
      )}
    >
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          <div>
            {title && <h3 className="text-lg font-bold text-white">{title}</h3>}
            {subtitle && <p className="text-sm text-[#6a8aaa] mt-1">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className="relative z-10">{children}</div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f1a2d]/20 to-transparent pointer-events-none" />
    </div>
  );
}