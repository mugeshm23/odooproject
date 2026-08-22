import React, { useState } from 'react';
import {
  FileText,
  Download,
  TrendingUp,
  BarChart3,
  PieChart,
  Calendar,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Building
} from 'lucide-react';
import { store } from '../services/store';
import { exportToCSV } from '../services/pdfGenerator';

export const ReportsView: React.FC = () => {
  const [reportPeriod, setReportPeriod] = useState('August 2026');

  const employees = store.getEmployees();
  const attendance = store.getAttendance();
  const leaves = store.getLeaveRequests();
  const payroll = store.getPayroll();
  const wellbeing = store.getWellbeingLogs();

  const handleExportAttendanceReport = () => {
    const headers = ['Date', 'Employee ID', 'Employee Name', 'Department', 'Check-In', 'Check-Out', 'Working Hours', 'Status', 'Location', 'Anomaly Reason'];
    const rows = attendance.map((a) => [
      a.date,
      a.employeeId,
      a.employeeName,
      a.department,
      a.checkIn || '--',
      a.checkOut || '--',
      a.workingHours,
      a.status,
      a.location,
      a.anomalyReason || 'Normal'
    ]);
    exportToCSV(`DayFlow_Audit_Attendance_${reportPeriod.replace(' ', '_')}.csv`, headers, rows);
  };

  const handleExportPayrollReport = () => {
    const headers = ['Slip Number', 'Employee ID', 'Name', 'Department', 'Month', 'Basic', 'Allowance', 'Bonus', 'Overtime', 'Deductions', 'Tax', 'Net Disbursed', 'Pay Date', 'Status'];
    const rows = payroll.map((p) => [
      p.slipNumber,
      p.employeeId,
      p.employeeName,
      p.department,
      p.month,
      p.basicSalary,
      p.allowance,
      p.bonus,
      p.overtimePay,
      p.deductions,
      p.tax,
      p.netSalary,
      p.payDate,
      p.status
    ]);
    exportToCSV(`DayFlow_Audit_Payroll_${reportPeriod.replace(' ', '_')}.csv`, headers, rows);
  };

  const handleExportLeavesReport = () => {
    const headers = ['Request ID', 'Employee ID', 'Name', 'Department', 'Type', 'Start Date', 'End Date', 'Days', 'Reason', 'Status', 'Reviewer Comment'];
    const rows = leaves.map((l) => [
      l.id,
      l.employeeId,
      l.employeeName,
      l.department,
      l.leaveType,
      l.startDate,
      l.endDate,
      l.daysCount,
      l.reason,
      l.status,
      l.reviewerComment || 'N/A'
    ]);
    exportToCSV(`DayFlow_Audit_Leaves_${reportPeriod.replace(' ', '_')}.csv`, headers, rows);
  };

  const handleExportWellbeingReport = () => {
    const headers = ['Log ID', 'Employee ID', 'Name', 'Date', 'Workload (1-5)', 'Energy (1-5)', 'Stress (1-5)', 'Satisfaction (1-5)', 'Overall Score (0-100)', 'Status', 'Support Needed'];
    const rows = wellbeing.map((w) => [
      w.id,
      w.employeeId,
      w.employeeName,
      w.date,
      w.workloadRating,
      w.energyRating,
      w.stressRating,
      w.satisfactionRating,
      w.overallScore,
      w.statusLevel,
      w.needsSupport ? 'YES' : 'NO'
    ]);
    exportToCSV(`DayFlow_Audit_Wellbeing_${reportPeriod.replace(' ', '_')}.csv`, headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Workforce Intelligence & Compliance Reports</h1>
          <p className="text-xs text-slate-500">
            Generate executive compliance audits, payroll ledgers, and department wellbeing summaries
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Audit Period:</span>
          <select
            value={reportPeriod}
            onChange={(e) => setReportPeriod(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-semibold text-slate-800"
          >
            <option value="August 2026">August 2026 (Current)</option>
            <option value="July 2026">July 2026</option>
            <option value="June 2026">June 2026</option>
            <option value="Q3 2026 YTD">Q3 2026 YTD</option>
          </select>
        </div>
      </div>

      {/* 4 Report Generator Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Report 1: Attendance */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-xs transition-all space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                Attendance & Time
              </span>
            </div>
            <h3 className="font-bold text-sm text-slate-900">Attendance & Punctuality Audit Ledger</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Complete employee-by-employee logs containing daily check-ins, check-outs, recorded anomalies, remote work flags, and overtime tallies.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">{attendance.length} Total Records</span>
            <button
              onClick={handleExportAttendanceReport}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-2xs flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV Audit</span>
            </button>
          </div>
        </div>

        {/* Report 2: Payroll */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-xs transition-all space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                <FileText className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Payroll & Finance
              </span>
            </div>
            <h3 className="font-bold text-sm text-slate-900">Comprehensive Payroll & Tax Register</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Disbursed salary items with itemized basic pay, allowances, statutory deductions, W-4 tax withholdings, bonuses, and slip references.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">{payroll.length} Generated Slips</span>
            <button
              onClick={handleExportPayrollReport}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-2xs flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV Register</span>
            </button>
          </div>
        </div>

        {/* Report 3: Leave */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-xs transition-all space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                <Users className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                Leave & Absence
              </span>
            </div>
            <h3 className="font-bold text-sm text-slate-900">Leave Utilization & Coverage Analysis</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Department-level time-off balances, approved vacations, emergency sick leaves, and HR reviewer comments.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">{leaves.length} Total Requests</span>
            <button
              onClick={handleExportLeavesReport}
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-2xs flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV Ledger</span>
            </button>
          </div>
        </div>

        {/* Report 4: Wellbeing */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-xs transition-all space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                Workforce Wellness
              </span>
            </div>
            <h3 className="font-bold text-sm text-slate-900">Wellbeing Sentiment & Burnout Risk Matrix</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Aggregated 5-factor wellness check-ins, early workload strain markers, and support ticket escalations for proactive HR intervention.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">{wellbeing.length} Logged Pulses</span>
            <button
              onClick={handleExportWellbeingReport}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-2xs flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV Matrix</span>
            </button>
          </div>
        </div>
      </div>

      {/* Compliance & Audit Policy Banner */}
      <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="space-y-1 text-xs">
          <h4 className="font-bold text-sm text-white">Automated Compliance & Non-Discrimination Safeguard</h4>
          <p className="text-slate-300 leading-relaxed">
            All DayFlow reports and Scikit-learn AI productivity predictions strictly follow the Fair Employment & Decision Support standard. No protected attributes (gender, age, race, religion) are utilized in any scoring or analytical models.
          </p>
        </div>
      </div>
    </div>
  );
};
