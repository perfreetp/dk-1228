import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Share2, Filter, Users, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/overview', label: '活动概览', icon: LayoutDashboard },
  { path: '/channels', label: '渠道分析', icon: Share2 },
  { path: '/funnel', label: '转化漏斗', icon: Filter },
  { path: '/attendees', label: '参会人明细', icon: Users },
  { path: '/reports', label: '报告中心', icon: FileText },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full bg-gradient-to-b from-[#1a2d4a] to-[#0f1a2d] border-r border-[#2a4a6a]/50 transition-all duration-300 z-50',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-4 py-6 border-b border-[#2a4a6a]/50">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff6b35] to-[#ff8c5a] flex items-center justify-center shadow-lg shadow-[#ff6b35]/20">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight">活动分析</h1>
                <p className="text-xs text-[#6a8aaa]">效果复盘平台</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-[#2a4a6a]/30 transition-colors text-[#6a8aaa] hover:text-white"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group',
                  isActive
                    ? 'bg-gradient-to-r from-[#ff6b35]/20 to-[#ff6b35]/5 text-[#ff6b35] border border-[#ff6b35]/30 shadow-lg shadow-[#ff6b35]/10'
                    : 'text-[#6a8aaa] hover:text-white hover:bg-[#2a4a6a]/30'
                )
              }
            >
              <item.icon className={cn('w-5 h-5', collapsed && 'mx-auto')} />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-[#2a4a6a]/50">
          {!collapsed && (
            <div className="bg-[#2a4a6a]/20 rounded-xl p-3">
              <p className="text-xs text-[#6a8aaa]">当前活动</p>
              <p className="text-sm text-white font-medium mt-1 truncate">2026春季新品发布会</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}