import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Clock,
  LogOut,
  Sparkles,
  User,
  Shield,
  Briefcase,
  ChevronDown,
  AlertTriangle,
  FileText,
  DollarSign,
  HeartHandshake
} from 'lucide-react';
import { User as UserType, NotificationItem } from '../types';
import { store } from '../services/store';

interface NavbarProps {
  currentUser: UserType | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  onQuickCheckIn?: () => void;
  onSwitchRole?: (newRole: 'admin' | 'employee') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onLogout,
  onQuickCheckIn,
  onSwitchRole
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = currentUser ? store.getNotifications(currentUser.role === 'admin' ? 'admin' : currentUser.employeeId) : [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const todayRecord = currentUser ? store.getTodayAttendance(currentUser.employeeId) : undefined;
  const isCheckedIn = !!todayRecord?.checkIn && !todayRecord?.checkOut;

  const getNotifIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'leave':
        return <FileText className="w-4 h-4 text-amber-500" />;
      case 'payroll':
        return <DollarSign className="w-4 h-4 text-emerald-500" />;
      case 'attendance':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'wellbeing':
        return <HeartHandshake className="w-4 h-4 text-rose-500" />;
      case 'ai':
        return <Sparkles className="w-4 h-4 text-indigo-500" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-8 bg-white border-b border-slate-200 shadow-xs">
      {/* Brand / Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2 text-left group focus:outline-hidden"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-blue-700 text-white shadow-md shadow-indigo-950/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-slate-900">DAYFLOW</span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-sm bg-indigo-50 text-indigo-700 border border-indigo-200">
                AI HRMS
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">Every workday, perfectly aligned</p>
          </div>
        </button>
      </div>

      {/* Center shortcuts / Role Switcher for Evaluators */}
      <div className="hidden md:flex items-center gap-2">
        <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs font-medium">
          <button
            onClick={() => onSwitchRole?.('employee')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              currentUser?.role === 'employee'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5 text-blue-600" />
            <span>Employee View</span>
          </button>
          <button
            onClick={() => onSwitchRole?.('admin')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              currentUser?.role === 'admin'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-indigo-600" />
            <span>Admin / HR View</span>
          </button>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Quick Check-in Button for Employee */}
        {currentUser?.role === 'employee' && (
          <button
            onClick={onQuickCheckIn}
            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              isCheckedIn
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-indigo-600 text-white border-transparent hover:bg-indigo-700 shadow-xs'
            }`}
          >
            {isCheckedIn ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Checked In ({todayRecord?.checkIn})</span>
              </>
            ) : (
              <>
                <Clock className="w-3.5 h-3.5" />
                <span>Quick Check In</span>
              </>
            )}
          </button>
        )}

        {/* Notifications Bell */}
        <div className="relative">
          <button
            id="btn-notifications-toggle"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-600 rounded-lg hover:bg-slate-100 focus:outline-hidden"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-rose-500 rounded-full ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-slate-800">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={() => {
                      store.markAllNotificationsRead(currentUser?.role === 'admin' ? 'admin' : currentUser?.employeeId);
                    }}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 text-sm">No notifications at this time.</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        store.markNotificationRead(n.id);
                        if (n.actionUrl) {
                          setActiveTab(n.actionUrl);
                          setShowNotifications(false);
                        }
                      }}
                      className={`p-3 text-xs flex gap-3 items-start cursor-pointer transition-colors ${
                        !n.isRead ? 'bg-indigo-50/50 hover:bg-indigo-50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs mt-0.5">
                        {getNotifIcon(n.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <p className="font-semibold text-slate-900 truncate">{n.title}</p>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-600 leading-relaxed line-clamp-2">{n.message}</p>
                      </div>
                      {!n.isRead && <div className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-2" />}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="relative">
          <button
            id="btn-user-profile-menu"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1.5 pl-2 pr-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors focus:outline-hidden"
          >
            <img
              src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={currentUser?.fullName || 'User'}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
            />
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-slate-800 truncate max-w-[120px]">
                {currentUser?.fullName}
              </div>
              <div className="text-[10px] text-slate-500 capitalize">
                {currentUser?.role === 'admin' ? 'HR Director' : currentUser?.department || 'Employee'}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Profile Menu Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3.5 py-2.5 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-900">{currentUser?.fullName}</p>
                <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-slate-100 text-slate-700 capitalize">
                  {currentUser?.role} Mode
                </span>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setActiveTab('profile');
                    setShowProfileMenu(false);
                  }}
                  className="w-full px-3.5 py-2 text-xs text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>My Profile</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('ai-assistant');
                    setShowProfileMenu(false);
                  }}
                  className="w-full px-3.5 py-2 text-xs text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <span>DayFlow AI Assistant</span>
                </button>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onLogout();
                  }}
                  className="w-full px-3.5 py-2 text-xs text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
