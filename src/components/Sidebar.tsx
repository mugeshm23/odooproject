import React from 'react';
import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarDays,
  CreditCard,
  Sparkles,
  HeartPulse,
  FileBarChart,
  User,
  DownloadCloud,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Role } from '../types';

interface SidebarProps {
  role: Role;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingLeavesCount?: number;
  onOpenZipModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  role,
  activeTab,
  setActiveTab,
  pendingLeavesCount = 0,
  onOpenZipModal
}) => {
  const employeeNav = [
    { id: 'dashboard', label: 'My Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'attendance', label: 'My Attendance', icon: Clock, badge: null },
    { id: 'leave', label: 'Leave Requests', icon: CalendarDays, badge: pendingLeavesCount > 0 ? `${pendingLeavesCount}` : null },
    { id: 'payroll', label: 'Payroll & Slips', icon: CreditCard, badge: null },
    { id: 'ai-assistant', label: 'DayFlow AI Copilot', icon: Sparkles, badge: 'AI', badgeColor: 'bg-indigo-100 text-indigo-700' },
    { id: 'wellbeing', label: 'Wellbeing Pulse', icon: HeartPulse, badge: 'Pulse', badgeColor: 'bg-emerald-100 text-emerald-700' },
    { id: 'profile', label: 'My Profile', icon: User, badge: null }
  ];

  const adminNav = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'employees', label: 'Employee Directory', icon: Users, badge: null },
    { id: 'attendance', label: 'Attendance Monitor', icon: Clock, badge: null },
    { id: 'leave', label: 'Leave Approvals', icon: CalendarDays, badge: pendingLeavesCount > 0 ? `${pendingLeavesCount} Pending` : null, badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'payroll', label: 'Payroll Operations', icon: CreditCard, badge: null },
    { id: 'ai-assistant', label: 'AI HR Assistant', icon: Sparkles, badge: 'Smart', badgeColor: 'bg-indigo-100 text-indigo-700' },
    { id: 'wellbeing', label: 'Team Wellbeing', icon: HeartPulse, badge: null },
    { id: 'reports', label: 'Reports & Analytics', icon: FileBarChart, badge: null }
  ];

  const navItems = role === 'admin' ? adminNav : employeeNav;

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 hidden md:flex border-r border-slate-800 select-none">
      {/* Upper Navigation Section */}
      <div className="p-4 space-y-6">
        {/* Role Badge Indicator */}
        <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-800/80 rounded-xl border border-slate-700/50">
          <div className={`p-1.5 rounded-lg ${role === 'admin' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-blue-500/20 text-blue-400'}`}>
            {role === 'admin' ? <ShieldCheck className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Active Workspace</p>
            <p className="text-xs font-semibold text-white capitalize">{role === 'admin' ? 'HR / Admin Portal' : 'Employee Portal'}</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Main Navigation</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badgeColor || 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-indigo-200" />}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Package & Hackathon Box */}
      <div className="p-4 space-y-3 border-t border-slate-800">
        <button
          onClick={onOpenZipModal}
          className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-slate-800 to-indigo-950/60 border border-slate-700/80 hover:border-indigo-500/50 text-left transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 group-hover:scale-105 transition-transform">
              <DownloadCloud className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Download Codebase</p>
              <p className="text-[10px] text-slate-400">Complete ZIP + FastAPI</p>
            </div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
        </button>

        <div className="px-3 py-2 text-[10px] text-slate-400 flex items-center justify-between">
          <span>DayFlow v2.4 (Hackathon Pro)</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Sync
          </span>
        </div>
      </div>
    </aside>
  );
};
