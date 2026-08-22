import React, { useState } from 'react';
import {
  Users,
  Clock,
  CalendarCheck,
  CreditCard,
  Sparkles,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileText,
  UserPlus,
  DownloadCloud,
  ChevronRight,
  HeartPulse,
  Building
} from 'lucide-react';
import { store } from '../services/store';
import { Employee, LeaveRequest } from '../types';

interface AdminDashboardProps {
  setActiveTab: (tab: string) => void;
  onOpenAddEmployee?: () => void;
  onOpenZipModal?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  setActiveTab,
  onOpenAddEmployee,
  onOpenZipModal
}) => {
  const [reviewModalRequest, setReviewModalRequest] = useState<LeaveRequest | null>(null);
  const [reviewerComment, setReviewerComment] = useState('');

  const employees = store.getEmployees();
  const allAttendance = store.getAttendance();
  const allLeaves = store.getLeaveRequests();
  const allPayroll = store.getPayroll();

  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = allAttendance.filter((a) => a.date === today);

  const presentCount = todayAttendance.filter((a) => a.status === 'Present' || a.status === 'Late').length;
  const lateCount = todayAttendance.filter((a) => a.status === 'Late').length;
  const absentCount = todayAttendance.filter((a) => a.status === 'Absent').length;
  const onLeaveToday = allLeaves.filter(
    (l) => l.status === 'Approved' && today >= l.startDate && today <= l.endDate
  ).length;

  const pendingLeaves = allLeaves.filter((l) => l.status === 'Pending');
  const attendanceRate = Math.round((presentCount / (employees.length || 1)) * 100);

  const totalPayrollDisbursed = allPayroll.reduce((acc, p) => acc + p.netSalary, 0);

  // Department counts
  const departmentCounts: Record<string, number> = {};
  employees.forEach((e) => {
    departmentCounts[e.department] = (departmentCounts[e.department] || 0) + 1;
  });

  const handleApprove = (req: LeaveRequest) => {
    store.reviewLeaveRequest(req.id, 'Approved', reviewerComment || 'Approved by HR');
    setReviewModalRequest(null);
    setReviewerComment('');
  };

  const handleReject = (req: LeaveRequest) => {
    store.reviewLeaveRequest(req.id, 'Rejected', reviewerComment || 'Cannot be accommodated at this time.');
    setReviewModalRequest(null);
    setReviewerComment('');
  };

  return (
    <div className="space-y-6">
      {/* Executive Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-lg border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
              EXECUTIVE HR PORTAL
            </span>
            <span className="text-xs text-slate-400">DayFlow Workforce Intelligence</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">People & Operations Command Center</h1>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Real-time workforce health, attendance consistency, automated payroll disbursements, and AI-driven burnout risk mitigation.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenAddEmployee}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Employee</span>
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center gap-2 transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Reports</span>
          </button>
        </div>
      </div>

      {/* 4 Primary Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:shadow-xs transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Workforce</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{employees.length}</span>
            <span className="text-xs text-slate-500">Active Staff</span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-2">
            <span>{presentCount} Present</span>
            <span>•</span>
            <span className="text-amber-600 font-medium">{lateCount} Late</span>
            <span>•</span>
            <span className="text-rose-600 font-medium">{absentCount} Absent</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:shadow-xs transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Today's Attendance</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{attendanceRate}%</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> Healthy
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            {presentCount} checked in • {onLeaveToday} on approved leave
          </p>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:shadow-xs transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending Approvals</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-600">{pendingLeaves.length}</span>
            <span className="text-xs text-slate-500">Requests</span>
          </div>
          <p className="text-[11px] text-slate-500">
            {pendingLeaves.length > 0 ? 'Requires HR director review' : 'All leave queues clear'}
          </p>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:shadow-xs transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Monthly Payroll Volume</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">${totalPayrollDisbursed.toLocaleString()}</span>
            <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-700 rounded-sm">
              Disbursed
            </span>
          </div>
          <p className="text-[11px] text-slate-500">{allPayroll.length} salary slips generated</p>
        </div>
      </div>

      {/* Anomaly & Risk Alerts Banner */}
      <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-100 text-amber-800">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-amber-900 block">Workforce Anomaly Flagged by DayFlow AI</span>
            <p className="text-amber-800 leading-tight">
              Marcus Vance (Finance) logged unplanned absence during audit week. David Kim (Design) recorded 3rd late arrival this month.
            </p>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('attendance')}
          className="px-3 py-1.5 bg-amber-800 text-white rounded-lg font-semibold hover:bg-amber-900 transition-colors shrink-0 text-xs shadow-2xs"
        >
          Investigate Anomalies
        </button>
      </div>

      {/* Main Analytics Section: Department Breakdown + Attendance Visual Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Attendance Visual Chart Box */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="font-bold text-sm text-slate-900">Weekly Attendance & Punctuality Trend</h2>
              <p className="text-[11px] text-slate-500">Tracking daily presence vs. late and remote logs</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              This Week (Aug 17 - Aug 21)
            </span>
          </div>

          {/* SVG/CSS Interactive Visual Chart */}
          <div className="space-y-4 pt-2">
            {[
              { day: 'Mon (Aug 17)', present: 96, late: 4, remote: 40 },
              { day: 'Tue (Aug 18)', present: 98, late: 2, remote: 35 },
              { day: 'Wed (Aug 19)', present: 92, late: 8, remote: 45 },
              { day: 'Thu (Aug 20)', present: 94, late: 6, remote: 38 },
              { day: 'Fri (Today)', present: 91, late: 9, remote: 50 }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex items-center justify-between font-medium">
                  <span className="text-slate-700 w-24">{item.day}</span>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span className="text-emerald-700 font-semibold">{item.present}% Present</span>
                    <span className="text-amber-700 font-medium">{item.late}% Late</span>
                    <span className="text-blue-700 font-medium">{item.remote}% Remote</span>
                  </div>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                  <div style={{ width: `${item.present - item.late}%` }} className="h-full bg-emerald-500" />
                  <div style={{ width: `${item.late}%` }} className="h-full bg-amber-400" />
                  <div style={{ width: `${100 - item.present}%` }} className="h-full bg-rose-400" />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> On-Time Present
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Late Arrival
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Absent / Unplanned
              </span>
            </div>
            <button
              onClick={() => setActiveTab('attendance')}
              className="text-indigo-600 font-semibold hover:underline"
            >
              Detailed Logs →
            </button>
          </div>
        </div>

        {/* Department Headcount Breakdown */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-bold text-sm text-slate-900">Department Distribution</h2>
            <Building className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3">
            {Object.entries(departmentCounts).map(([dept, count]) => {
              const pct = Math.round((count / employees.length) * 100);
              return (
                <div key={dept} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">{dept}</span>
                    <span className="font-bold text-slate-900">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className={`h-full ${
                        dept === 'Engineering'
                          ? 'bg-blue-600'
                          : dept === 'Product Design'
                            ? 'bg-indigo-500'
                            : dept === 'Finance'
                              ? 'bg-emerald-500'
                              : dept === 'Marketing'
                                ? 'bg-amber-500'
                                : 'bg-purple-500'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('employees')}
              className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Manage All Employees</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pending Leave Approvals Table */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-indigo-600" />
            <h2 className="font-bold text-sm text-slate-900">Pending Leave Approvals Queue</h2>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
            {pendingLeaves.length} Awaiting Decision
          </span>
        </div>

        {pendingLeaves.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            ✓ All employee leave requests have been reviewed and resolved.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Employee</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Leave Type</th>
                  <th className="p-3">Dates & Duration</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingLeaves.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={req.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                          alt={req.employeeName}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">{req.employeeName}</span>
                          <span className="text-[10px] text-slate-400">{req.employeeId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-slate-600">{req.department}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-800">
                        {req.leaveType}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="font-semibold text-slate-800">{req.daysCount} Day(s)</span>
                      <span className="text-[10px] text-slate-400 block">
                        {req.startDate} → {req.endDate}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 max-w-xs truncate" title={req.reason}>
                      {req.reason}
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleApprove(req)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-[11px] shadow-2xs transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(req)}
                        className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg font-semibold text-[11px] transition-colors"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
