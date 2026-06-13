import { Bell, Settings, User, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#0f1a2d]/80 backdrop-blur-xl border-b border-[#2a4a6a]/30">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
            {subtitle && (
              <p className="text-sm text-[#6a8aaa] flex items-center gap-2 mt-1">
                <Calendar className="w-3.5 h-3.5" />
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2.5 rounded-xl bg-[#2a4a6a]/20 hover:bg-[#2a4a6a]/40 transition-colors text-[#6a8aaa] hover:text-white">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2.5 rounded-xl bg-[#2a4a6a]/20 hover:bg-[#2a4a6a]/40 transition-colors text-[#6a8aaa] hover:text-white">
            <Settings className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 pl-3 border-l border-[#2a4a6a]/30">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00d4aa] to-[#00b894] flex items-center justify-center shadow-lg shadow-[#00d4aa]/20">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-white">张明</p>
              <p className="text-xs text-[#6a8aaa]">市场分析师</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}