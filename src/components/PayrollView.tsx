import React, { useState } from 'react';
import {
  CreditCard,
  Download,
  FileText,
  DollarSign,
  TrendingUp,
  PlusCircle,
  Building,
  CheckCircle2,
  Calendar,
  Eye
} from 'lucide-react';
import { store } from '../services/store';
import { PayrollRecord, User as UserType } from '../types';
import { generateSalarySlipPDF, exportToCSV } from '../services/pdfGenerator';

interface PayrollViewProps {
  currentUser: UserType;
}

export const PayrollView: React.FC<PayrollViewProps> = ({ currentUser }) => {
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState('EMP-1001');
  const [month, setMonth] = useState('August 2026');
  const [bonus, setBonus] = useState(0);
  const [overtimePay, setOvertimePay] = useState(0);

  const isAdmin = currentUser.role === 'admin';
  const payrollList = store.getPayroll(isAdmin ? undefined : currentUser.employeeId);
  const employeeRecord = store.getEmployeeById(currentUser.employeeId);
  const allEmployees = store.getEmployees();

  const handleDownloadPDF = (record: PayrollRecord) => {
    const emp = store.getEmployeeById(record.employeeId);
    generateSalarySlipPDF(record, emp);
  };

  const handleExportPayrollCSV = () => {
    const headers = ['Slip Number', 'Employee ID', 'Employee Name', 'Department', 'Month', 'Basic', 'Allowances', 'Bonus', 'Overtime', 'Deductions', 'Tax', 'Net Salary', 'Pay Date', 'Status'];
    const rows = payrollList.map((p) => [
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
    exportToCSV(`DayFlow_Payroll_${new Date().toISOString().split('T')[0]}.csv`, headers, rows);
  };

  const handleGeneratePayroll = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = store.getEmployeeById(selectedEmpId);
    if (!emp) return;

    store.addPayrollRecord({
      employeeId: emp.employeeId,
      employeeName: emp.fullName,
      department: emp.department,
      designation: emp.designation,
      month,
      payPeriod: `01 ${month.split(' ')[0]} 2026 - 30 ${month.split(' ')[0]} 2026`,
      basicSalary: emp.salary.basic,
      allowance: emp.salary.allowance,
      bonus: Number(bonus) || 0,
      overtimePay: Number(overtimePay) || 0,
      deductions: emp.salary.deductions,
      tax: emp.salary.tax,
      payDate: new Date().toISOString().split('T')[0],
      status: 'Paid',
      bankAccount: 'Direct Deposit •••• 4912'
    });

    setShowGenerateModal(false);
    setBonus(0);
    setOvertimePay(0);
  };

  const currentSalary = employeeRecord?.salary || {
    basic: 7500,
    allowance: 1800,
    deductions: 650,
    tax: 1150,
    netSalary: 7500
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Payroll & Compensation Management</h1>
          <p className="text-xs text-slate-500">
            {isAdmin ? 'Manage workforce payroll records, allowances, and official PDF slips' : 'View your compensation structure and download official PDF salary slips'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <button
              onClick={() => setShowGenerateModal(true)}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Generate New Slip</span>
            </button>
          )}

          <button
            onClick={handleExportPayrollCSV}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-2 shadow-2xs transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Salary Structure Card (For Employee) */}
      {!isAdmin && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="font-bold text-sm text-slate-900">Current Salary & Compensation Breakdown</h2>
              <p className="text-[11px] text-slate-500">Official contract figures registered with Finance</p>
            </div>
            <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800">
              Active Compensation Plan
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] text-slate-500 block">Basic Base</span>
              <span className="text-lg font-bold text-slate-900">${currentSalary.basic.toLocaleString()}</span>
              <span className="text-[10px] text-slate-400 block">Monthly fixed</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] text-slate-500 block">Allowances (HRA/Med)</span>
              <span className="text-lg font-bold text-emerald-600">+${currentSalary.allowance.toLocaleString()}</span>
              <span className="text-[10px] text-slate-400 block">Non-taxable benefits</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] text-slate-500 block">Statutory Deductions</span>
              <span className="text-lg font-bold text-rose-600">-${currentSalary.deductions.toLocaleString()}</span>
              <span className="text-[10px] text-slate-400 block">PF & Health Insurance</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] text-slate-500 block">Income Tax (W-4)</span>
              <span className="text-lg font-bold text-rose-600">-${currentSalary.tax.toLocaleString()}</span>
              <span className="text-[10px] text-slate-400 block">Federal/State</span>
            </div>

            <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 col-span-2 sm:col-span-1">
              <span className="text-[11px] text-indigo-700 font-semibold block">Net Take-Home</span>
              <span className="text-lg font-extrabold text-indigo-900">${currentSalary.netSalary.toLocaleString()}</span>
              <span className="text-[10px] text-indigo-600 block">Direct Deposit</span>
            </div>
          </div>
        </div>
      )}

      {/* Payslips History List */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="font-bold text-sm text-slate-900">
            {isAdmin ? 'All Disbursed Salary Slips' : 'My Disbursed Salary Slips'}
          </h2>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {payrollList.length} Records
          </span>
        </div>

        {payrollList.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No payroll slips generated yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Slip Reference</th>
                  <th className="p-3">Employee</th>
                  <th className="p-3">Period / Month</th>
                  <th className="p-3">Gross Earnings</th>
                  <th className="p-3">Deductions & Tax</th>
                  <th className="p-3">Net Disbursed</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Official Document</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payrollList.map((slip) => {
                  const gross = slip.basicSalary + slip.allowance + slip.bonus + slip.overtimePay;
                  const totalDed = slip.deductions + slip.tax;
                  return (
                    <tr key={slip.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-mono text-[11px] font-semibold text-slate-700">{slip.slipNumber}</td>
                      <td className="p-3">
                        <span className="font-bold text-slate-900 block">{slip.employeeName}</span>
                        <span className="text-[10px] text-slate-400">{slip.department}</span>
                      </td>
                      <td className="p-3 font-medium text-slate-800">{slip.month}</td>
                      <td className="p-3 font-semibold text-slate-800">${gross.toLocaleString()}</td>
                      <td className="p-3 text-rose-600 font-medium">-${totalDed.toLocaleString()}</td>
                      <td className="p-3 font-bold text-indigo-700 text-sm">${slip.netSalary.toLocaleString()}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {slip.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDownloadPDF(slip)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs border border-indigo-200 transition-colors inline-flex items-center gap-1.5 shadow-2xs"
                        >
                          <Download className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Download PDF Slip</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Generate Salary Slip Modal (For Admin) */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white">
              <h3 className="font-bold text-base">Generate Employee Salary Slip</h3>
              <p className="text-xs text-slate-300">Creates an official verified payslip record.</p>
            </div>

            <form onSubmit={handleGeneratePayroll} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Employee</label>
                <select
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  {allEmployees.map((emp) => (
                    <option key={emp.employeeId} value={emp.employeeId}>
                      {emp.fullName} ({emp.employeeId}) — {emp.department}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Salary Month</label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="August 2026">August 2026</option>
                  <option value="September 2026">September 2026</option>
                  <option value="October 2026">October 2026</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Performance Bonus ($)</label>
                  <input
                    type="number"
                    value={bonus}
                    onChange={(e) => setBonus(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Overtime Pay ($)</label>
                  <input
                    type="number"
                    value={overtimePay}
                    onChange={(e) => setOvertimePay(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20"
                >
                  Generate & Disburse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
