import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  CalendarDays,
  CreditCard,
  HeartPulse,
  Sparkles,
  ArrowUpRight,
  MapPin,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  FileText,
  User,
  ShieldCheck,
  Zap,
  Coffee
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { User as UserType, AIInsight } from '../types';
import { store } from '../services/store';

interface EmployeeDashboardProps {
  currentUser: UserType;
  setActiveTab: (tab: string) => void;
  onOpenCheckinModal?: () => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({
  currentUser,
  setActiveTab
}) => {
  const [selectedLocation, setSelectedLocation] = useState<'HQ Office' | 'Remote - Home' | 'Client Site'>('HQ Office');
  const [attendanceNote, setAttendanceNote] = useState('');

  const todayRecord = store.getTodayAttendance(currentUser.employeeId);
  const isCheckedIn = !!todayRecord?.checkIn && !todayRecord?.checkOut;
  const isCheckedOut = !!todayRecord?.checkOut;

  const leaveBalance = store.getLeaveBalances(currentUser.employeeId);
  const totalRemainingLeaves =
    leaveBalance.paidTotal - leaveBalance.paidUsed + (leaveBalance.sickTotal - leaveBalance.sickUsed) + (leaveBalance.casualTotal - leaveBalance.casualUsed);

  const pendingLeaves = store.getLeaveRequests(currentUser.employeeId).filter((l) => l.status === 'Pending');
  const latestPayroll = store.getPayroll(currentUser.employeeId)[0];
  const aiInsight = (store.getAIInsights(currentUser.employeeId) || {}) as AIInsight;
  const recentWellbeing = store.getWellbeingLogs(currentUser.employeeId)[0];

  const handleCheckIn = () => {
    store.checkIn(currentUser.employeeId, selectedLocation, attendanceNote);
    setAttendanceNote('');
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // Confetti fallback
    }
  };

  const handleCheckOut = () => {
    store.checkOut(currentUser.employeeId, attendanceNote);
    setAttendanceNote('');
  };

  const greetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-lg shadow-slate-900/10 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
              {currentUser.department}
            </span>
            <span className="text-xs text-slate-400">ID: {currentUser.employeeId}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            {greetingTime()}, {currentUser.fullName.split(' ')[0]} 👋
          </h1>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Welcome to your DayFlow workstation. Your schedule, attendance, leaves, and AI wellness indicators are synced in real time.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60 text-xs">
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-slate-400">Current Date</p>
            <p className="font-semibold text-white">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* Primary Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Attendance Consistency */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Attendance Score</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{aiInsight.attendanceScore || 94}%</span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +2.4%
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">94% on-time arrivals this month</p>
          </div>
        </div>

        {/* Metric 2: Leave Balance */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Available Leaves</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{totalRemainingLeaves} Days</span>
              <span className="text-xs text-slate-500">Remaining</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {leaveBalance.paidTotal - leaveBalance.paidUsed} Paid • {leaveBalance.sickTotal - leaveBalance.sickUsed} Sick • {leaveBalance.casualTotal - leaveBalance.casualUsed} Casual
            </p>
          </div>
        </div>

        {/* Metric 3: Latest Disbursed Salary */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Monthly Net Salary</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">
                ${latestPayroll ? latestPayroll.netSalary.toLocaleString() : '7,500'}
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-700 rounded-sm">
                Disbursed
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Pay Period: {latestPayroll ? latestPayroll.month : 'August 2026'}</p>
          </div>
        </div>

        {/* Metric 4: Wellbeing Score */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Wellbeing Pulse</span>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
              <HeartPulse className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{recentWellbeing?.overallScore || 84}/100</span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-700 rounded-sm">
                {recentWellbeing?.statusLevel || 'Thriving'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Stress level: Balanced • Energy: High</p>
          </div>
        </div>
      </div>

      {/* Main Row: Check-in / Punch Section + AI Productivity Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Attendance Action Box */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              <h2 className="font-bold text-sm text-slate-900">Today's Attendance Station</h2>
            </div>
            <span
              className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                isCheckedIn
                  ? 'bg-emerald-100 text-emerald-800'
                  : isCheckedOut
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-amber-100 text-amber-800'
              }`}
            >
              {isCheckedIn ? '● Active Workday' : isCheckedOut ? '✓ Completed' : '○ Not Checked In'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[11px] text-slate-500 block">Check-in Log</span>
                <span className="font-bold text-slate-800 text-sm">{todayRecord?.checkIn || '--:--'}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Check-out Log</span>
                <span className="font-bold text-slate-800 text-sm">{todayRecord?.checkOut || '--:--'}</span>
              </div>
            </div>

            <div className="border-t border-slate-200/60 pt-2 flex items-center justify-between text-xs">
              <span className="text-slate-600">Logged Hours Today:</span>
              <span className="font-bold text-indigo-700 text-sm">
                {todayRecord?.workingHours ? `${todayRecord.workingHours} hrs` : isCheckedIn ? 'In Progress' : '0.0 hrs'}
              </span>
            </div>
          </div>

          {/* Location selector */}
          {!isCheckedOut && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>Work Location</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['HQ Office', 'Remote - Home', 'Client Site'] as const).map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setSelectedLocation(loc)}
                      className={`py-1.5 px-2 rounded-lg text-center font-medium border text-[11px] transition-colors ${
                        selectedLocation === loc
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-semibold'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {loc === 'HQ Office' ? '🏢 HQ Office' : loc === 'Remote - Home' ? '🏠 Remote' : '✈️ Client'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Activity / Focus Note (Optional)</label>
                <input
                  type="text"
                  value={attendanceNote}
                  onChange={(e) => setAttendanceNote(e.target.value)}
                  placeholder="e.g. Working on sprint backlog and client deliverables"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-1">
                {!isCheckedIn ? (
                  <button
                    onClick={handleCheckIn}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Check In Now</span>
                  </button>
                ) : (
                  <button
                    onClick={handleCheckOut}
                    className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/25 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Check Out & End Day</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {isCheckedOut && (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center text-xs text-emerald-800 font-medium">
              🎉 Workday completed! Great job today.
            </div>
          )}
        </div>

        {/* DayFlow AI Productivity Engine Insights Card */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 text-white shadow-2xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-slate-900">DayFlow AI • Productivity & Risk Engine</h2>
                <p className="text-[11px] text-slate-500">Scikit-learn Model: RandomForestRegressor</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('ai-assistant')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>Ask AI Copilot</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Productivity Index</span>
              <span className="text-xl font-extrabold text-indigo-700">{aiInsight.productivityScore || 86} / 100</span>
              <span className="text-[10px] text-emerald-600 block mt-0.5">Top 15% in Department</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Burnout Risk</span>
              <span className="text-xl font-extrabold text-emerald-600">{aiInsight.burnoutRisk || 'Low'}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Safe Recovery Index</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Workload Level</span>
              <span className="text-xl font-extrabold text-slate-800">{aiInsight.workloadLevel || 'Optimal'}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Healthy sprint pacing</span>
            </div>
          </div>

          {/* Explainable Factor Breakdown */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Explainable AI Factor Breakdown</span>
            </p>
            <div className="space-y-1.5">
              {(aiInsight.keyFactors || []).map((factor, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 text-xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        factor.impact === 'positive'
                          ? 'bg-emerald-500'
                          : factor.impact === 'negative'
                            ? 'bg-rose-500'
                            : 'bg-slate-400'
                      }`}
                    />
                    <div>
                      <span className="font-semibold text-slate-800">{factor.name}</span>
                      <p className="text-[10px] text-slate-500">{factor.description}</p>
                    </div>
                  </div>
                  <span
                    className={`font-bold text-xs shrink-0 ${
                      factor.impact === 'positive'
                        ? 'text-emerald-600'
                        : factor.impact === 'negative'
                          ? 'text-rose-600'
                          : 'text-slate-600'
                    }`}
                  >
                    {factor.score > 0 ? `+${factor.score}%` : `${factor.score}%`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable recommendation */}
          <div className="p-3.5 rounded-xl bg-indigo-50/80 border border-indigo-100 text-xs text-indigo-900 leading-relaxed flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">AI Workday Recommendation:</span>
              <p>{aiInsight.actionableRecommendation || 'Maintain scheduled hydration breaks and protect deep-work focus blocks.'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Row: Quick Navigation & Pending Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quick Action Shortcuts */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Workstation Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <button
              onClick={() => setActiveTab('leave')}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-500/50 hover:bg-indigo-50/40 text-left transition-all group"
            >
              <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700 w-fit mb-2 group-hover:scale-105 transition-transform">
                <CalendarDays className="w-4 h-4" />
              </div>
              <span className="font-bold text-xs text-slate-800 block">Apply Leave</span>
              <span className="text-[10px] text-slate-500">Plan vacation or sick day</span>
            </button>

            <button
              onClick={() => setActiveTab('payroll')}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500/50 hover:bg-emerald-50/40 text-left transition-all group"
            >
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 w-fit mb-2 group-hover:scale-105 transition-transform">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="font-bold text-xs text-slate-800 block">Payslips</span>
              <span className="text-[10px] text-slate-500">Download official PDF</span>
            </button>

            <button
              onClick={() => setActiveTab('wellbeing')}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-rose-500/50 hover:bg-rose-50/40 text-left transition-all group"
            >
              <div className="p-2 rounded-lg bg-rose-100 text-rose-700 w-fit mb-2 group-hover:scale-105 transition-transform">
                <HeartPulse className="w-4 h-4" />
              </div>
              <span className="font-bold text-xs text-slate-800 block">Wellbeing Pulse</span>
              <span className="text-[10px] text-slate-500">Daily 5-factor check-in</span>
            </button>

            <button
              onClick={() => setActiveTab('ai-assistant')}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-purple-500/50 hover:bg-purple-50/40 text-left transition-all group"
            >
              <div className="p-2 rounded-lg bg-purple-100 text-purple-700 w-fit mb-2 group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-xs text-slate-800 block">AI Copilot</span>
              <span className="text-[10px] text-slate-500">Ask HR & policy questions</span>
            </button>

            <button
              onClick={() => setActiveTab('attendance')}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-500/50 hover:bg-blue-50/40 text-left transition-all group"
            >
              <div className="p-2 rounded-lg bg-blue-100 text-blue-700 w-fit mb-2 group-hover:scale-105 transition-transform">
                <Clock className="w-4 h-4" />
              </div>
              <span className="font-bold text-xs text-slate-800 block">Attendance History</span>
              <span className="text-[10px] text-slate-500">Logs & monthly calendar</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-400 hover:bg-slate-50 text-left transition-all group"
            >
              <div className="p-2 rounded-lg bg-slate-100 text-slate-700 w-fit mb-2 group-hover:scale-105 transition-transform">
                <User className="w-4 h-4" />
              </div>
              <span className="font-bold text-xs text-slate-800 block">My Profile</span>
              <span className="text-[10px] text-slate-500">Job, docs, & contact</span>
            </button>
          </div>
        </div>

        {/* Pending Requests & Alerts */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Pending Requests & Tracking</h3>
            <button
              onClick={() => setActiveTab('leave')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              View All
            </button>
          </div>

          <div className="space-y-2.5">
            {pendingLeaves.length === 0 ? (
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                No pending leave requests. Everything is up to date.
              </div>
            ) : (
              pendingLeaves.map((l) => (
                <div
                  key={l.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{l.leaveType}</span>
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-800 rounded-full">
                        Pending HR Approval
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {l.startDate} to {l.endDate} ({l.daysCount} days)
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('leave')}
                    className="px-2.5 py-1 text-xs rounded-lg bg-white border border-slate-200 font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Details
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Coffee className="w-4 h-4 text-emerald-600" />
              <span>Have you completed today's 1-minute Wellbeing Pulse check?</span>
            </div>
            <button
              onClick={() => setActiveTab('wellbeing')}
              className="px-2.5 py-1 rounded-md bg-emerald-600 text-white font-semibold text-[11px] hover:bg-emerald-700 shadow-2xs"
            >
              Start Pulse
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
