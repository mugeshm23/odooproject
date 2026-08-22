import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  Calendar,
  Filter,
  Download,
  AlertTriangle,
  MapPin,
  Search,
  TrendingUp,
  User,
  PlusCircle
} from 'lucide-react';
import { store } from '../services/store';
import { AttendanceRecord, Role, User as UserType } from '../types';
import { exportToCSV } from '../services/pdfGenerator';
import confetti from 'canvas-confetti';

interface AttendanceViewProps {
  currentUser: UserType;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({ currentUser }) => {
  const [selectedLocation, setSelectedLocation] = useState<'HQ Office' | 'Remote - Home' | 'Client Site'>('HQ Office');
  const [notes, setNotes] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const isAdmin = currentUser.role === 'admin';
  const attendanceList = store.getAttendance(isAdmin ? undefined : { employeeId: currentUser.employeeId });
  const todayRecord = store.getTodayAttendance(currentUser.employeeId);
  const isCheckedIn = !!todayRecord?.checkIn && !todayRecord?.checkOut;
  const isCheckedOut = !!todayRecord?.checkOut;

  const handleCheckIn = () => {
    store.checkIn(currentUser.employeeId, selectedLocation, notes);
    setNotes('');
    try {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
    } catch {}
  };

  const handleCheckOut = () => {
    store.checkOut(currentUser.employeeId, notes);
    setNotes('');
  };

  const filteredAttendance = attendanceList.filter((item) => {
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    if (dateFilter && item.date !== dateFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.employeeName.toLowerCase().includes(q) ||
        item.employeeId.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportCSV = () => {
    const headers = ['Date', 'Employee ID', 'Employee Name', 'Department', 'Check-In', 'Check-Out', 'Hours', 'Status', 'Location', 'Anomaly Reason'];
    const rows = filteredAttendance.map((a) => [
      a.date,
      a.employeeId,
      a.employeeName,
      a.department,
      a.checkIn || 'N/A',
      a.checkOut || 'N/A',
      a.workingHours,
      a.status,
      a.location,
      a.anomalyReason || ''
    ]);
    exportToCSV(`DayFlow_Attendance_${new Date().toISOString().split('T')[0]}.csv`, headers, rows);
  };

  const totalHours = filteredAttendance.reduce((acc, a) => acc + (a.workingHours || 0), 0);
  const avgHours = filteredAttendance.length ? (totalHours / filteredAttendance.length).toFixed(1) : '8.0';
  const anomalyCount = attendanceList.filter((a) => a.anomalyFlag).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Attendance & Punctuality Center</h1>
          <p className="text-xs text-slate-500">
            {isAdmin ? 'Real-time workforce monitoring and anomaly detection' : 'Daily punch station and personal time tracking'}
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-2 shadow-2xs transition-colors"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Export Attendance CSV</span>
        </button>
      </div>

      {/* Quick Punch Station (For Employees or Admins tracking own punch) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            <h2 className="font-bold text-sm text-slate-900">Today's Punch Station ({new Date().toISOString().split('T')[0]})</h2>
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
            {isCheckedIn ? '● Active In Progress' : isCheckedOut ? '✓ Completed' : '○ Not Checked In'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] text-slate-500 block">Check-in Time</span>
            <span className="text-lg font-bold text-slate-900">{todayRecord?.checkIn || '--:--'}</span>
            <span className="text-[10px] text-slate-400 block">{todayRecord?.location || 'Office HQ'}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] text-slate-500 block">Check-out Time</span>
            <span className="text-lg font-bold text-slate-900">{todayRecord?.checkOut || '--:--'}</span>
            <span className="text-[10px] text-slate-400 block">{isCheckedOut ? 'Logged' : 'Pending end of shift'}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] text-slate-500 block">Hours Logged</span>
            <span className="text-lg font-bold text-indigo-700">
              {todayRecord?.workingHours ? `${todayRecord.workingHours} hrs` : isCheckedIn ? 'In Progress' : '0.0 hrs'}
            </span>
            <span className="text-[10px] text-emerald-600 block">Target: 8.0 hrs</span>
          </div>
        </div>

        {!isCheckedOut && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end pt-2">
            <div className="md:col-span-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Work Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
              >
                <option value="HQ Office">🏢 HQ Office Campus</option>
                <option value="Remote - Home">🏠 Remote (Home Office)</option>
                <option value="Client Site">✈️ Client Site / Travel</option>
              </select>
            </div>

            <div className="md:col-span-5">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Focus Note</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Core sprint development & standup"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div className="md:col-span-3">
              {!isCheckedIn ? (
                <button
                  onClick={handleCheckIn}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  <span>Check In Now</span>
                </button>
              ) : (
                <button
                  onClick={handleCheckOut}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Check Out</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Anomaly banner if anomalies exist */}
      {isAdmin && anomalyCount > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs flex items-center justify-between text-amber-900">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold block">DayFlow AI Attendance Anomaly Alerts:</span>
              <span>{anomalyCount} flagged records (clusters of late arrivals or unplanned absences).</span>
            </div>
          </div>
          <button
            onClick={() => setStatusFilter('Late')}
            className="px-2.5 py-1 bg-amber-200/80 hover:bg-amber-300 rounded-md font-semibold text-amber-900"
          >
            Filter Late/Anomalies
          </button>
        </div>
      )}

      {/* Attendance Records Table with Filters */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <h2 className="font-bold text-sm text-slate-900">Historical Attendance Logs</h2>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {isAdmin && (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 w-44"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            )}

            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
            >
              <option value="all">All Statuses</option>
              <option value="Present">Present</option>
              <option value="Late">Late</option>
              <option value="Absent">Absent</option>
              <option value="Half-day">Half-day</option>
            </select>

            {(statusFilter !== 'all' || dateFilter || searchQuery) && (
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setDateFilter('');
                  setSearchQuery('');
                }}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold px-2"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Employee</th>
                <th className="p-3">Check-In</th>
                <th className="p-3">Check-Out</th>
                <th className="p-3">Hours</th>
                <th className="p-3">Location</th>
                <th className="p-3">Status</th>
                <th className="p-3">AI / Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAttendance.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No attendance records match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredAttendance.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-semibold text-slate-800 whitespace-nowrap">{rec.date}</td>
                    <td className="p-3">
                      <span className="font-bold text-slate-900 block">{rec.employeeName}</span>
                      <span className="text-[10px] text-slate-400">{rec.employeeId}</span>
                    </td>
                    <td className="p-3 font-medium text-slate-800">{rec.checkIn || '--:--'}</td>
                    <td className="p-3 font-medium text-slate-800">{rec.checkOut || '--:--'}</td>
                    <td className="p-3 font-bold text-slate-800">{rec.workingHours ? `${rec.workingHours} hrs` : '--'}</td>
                    <td className="p-3 text-slate-600 whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{rec.location}</span>
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          rec.status === 'Present'
                            ? 'bg-emerald-100 text-emerald-800'
                            : rec.status === 'Late'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>
                    <td className="p-3 max-w-xs text-slate-600">
                      {rec.anomalyReason ? (
                        <span className="text-amber-800 font-medium flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>{rec.anomalyReason}</span>
                        </span>
                      ) : (
                        <span>{rec.notes || 'Normal entry'}</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
