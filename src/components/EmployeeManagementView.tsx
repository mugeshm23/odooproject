import React, { useState } from 'react';
import {
  Users,
  Search,
  PlusCircle,
  Download,
  Filter,
  Eye,
  Edit2,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  DollarSign,
  Shield,
  CheckCircle2,
  XCircle,
  X
} from 'lucide-react';
import { store } from '../services/store';
import { Employee, Department } from '../types';
import { exportToCSV } from '../services/pdfGenerator';

export const EmployeeManagementView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Employee Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [department, setDepartment] = useState<Department>('Engineering');
  const [designation, setDesignation] = useState('');
  const [phone, setPhone] = useState('');
  const [joinDate, setJoinDate] = useState(new Date().toISOString().split('T')[0]);
  const [basicSalary, setBasicSalary] = useState(7500);
  const [allowance, setAllowance] = useState(1500);
  const [deductions, setDeductions] = useState(600);
  const [tax, setTax] = useState(1100);

  const employees = store.getEmployees();

  const filteredEmployees = employees.filter((emp) => {
    if (selectedDept !== 'all' && emp.department !== selectedDept) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        emp.fullName.toLowerCase().includes(q) ||
        emp.employeeId.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        emp.designation.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportCSV = () => {
    const headers = [
      'Employee ID',
      'Full Name',
      'Email',
      'Department',
      'Designation',
      'Join Date',
      'Phone',
      'Status',
      'Basic Salary',
      'Net Salary'
    ];
    const rows = filteredEmployees.map((e) => [
      e.employeeId,
      e.fullName,
      e.email,
      e.department,
      e.designation,
      e.joiningDate,
      e.phone,
      e.status,
      e.salary.basic,
      e.salary.netSalary
    ]);
    exportToCSV(`DayFlow_Employees_${new Date().toISOString().split('T')[0]}.csv`, headers, rows);
  };

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !designation.trim()) return;

    const autoId = employeeId.trim() || `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
    const net = Number(basicSalary) + Number(allowance) - Number(deductions) - Number(tax);

    store.addEmployee({
      employeeId: autoId,
      fullName: fullName.trim(),
      email: email.trim(),
      department,
      designation: designation.trim(),
      joiningDate: joinDate,
      status: 'Active',
      phone: phone.trim() || '+1 (555) 000-0000',
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`,
      salary: {
        basic: Number(basicSalary),
        allowance: Number(allowance),
        deductions: Number(deductions),
        tax: Number(tax),
        netSalary: net
      },
      documents: []
    });

    setShowAddModal(false);
    // Reset
    setFullName('');
    setEmail('');
    setEmployeeId('');
    setDesignation('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Workforce & Employee Directory</h1>
          <p className="text-xs text-slate-500">Manage employee profiles, roles, departments, and compensation models</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Employee</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-2 shadow-2xs transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, ID, title, or email..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-slate-500 font-medium">Department:</span>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
          >
            <option value="all">All Departments ({employees.length})</option>
            <option value="Engineering">Engineering</option>
            <option value="Product Design">Product Design</option>
            <option value="Product">Product</option>
            <option value="Marketing">Marketing</option>
            <option value="Finance">Finance</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Operations">Operations</option>
          </select>
        </div>
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.map((emp) => (
          <div
            key={emp.id}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-xs transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <img
                    src={emp.avatarUrl}
                    alt={emp.fullName}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{emp.fullName}</h3>
                    <p className="text-xs text-slate-500 font-medium">{emp.designation}</p>
                    <span className="text-[10px] text-slate-400 font-mono">{emp.employeeId}</span>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    emp.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {emp.status}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Department</span>
                  <span className="font-semibold text-slate-800">{emp.department}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Email</span>
                  <span className="font-medium text-slate-700 truncate max-w-[150px]">{emp.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Net Salary</span>
                  <span className="font-bold text-indigo-700">${emp.salary.netSalary.toLocaleString()} /mo</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Joined {emp.joiningDate}</span>
              <button
                onClick={() => setSelectedEmployee(emp)}
                className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Full Profile</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-slate-900 to-indigo-950 text-white relative">
              <button
                onClick={() => setSelectedEmployee(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4">
                <img
                  src={selectedEmployee.avatarUrl}
                  alt={selectedEmployee.fullName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20"
                />
                <div>
                  <h3 className="font-bold text-lg">{selectedEmployee.fullName}</h3>
                  <p className="text-xs text-indigo-200 font-medium">{selectedEmployee.designation}</p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {selectedEmployee.employeeId} • {selectedEmployee.department}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4 text-xs max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-400 block">Work Email</span>
                  <span className="font-semibold text-slate-800">{selectedEmployee.email}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-400 block">Phone</span>
                  <span className="font-semibold text-slate-800">{selectedEmployee.phone}</span>
                </div>
              </div>

              {/* Compensation */}
              <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-2">
                <h4 className="font-bold text-indigo-950 text-xs">Compensation Structure</h4>
                <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                  <div className="bg-white p-2 rounded-lg border border-indigo-100">
                    <span className="text-slate-400 block">Basic</span>
                    <span className="font-bold text-slate-900">${selectedEmployee.salary.basic}</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-indigo-100">
                    <span className="text-slate-400 block">Allowance</span>
                    <span className="font-bold text-emerald-600">+${selectedEmployee.salary.allowance}</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-indigo-100">
                    <span className="text-slate-400 block">Deductions</span>
                    <span className="font-bold text-rose-600">-${selectedEmployee.salary.deductions}</span>
                  </div>
                  <div className="bg-indigo-600 p-2 rounded-lg text-white">
                    <span className="text-indigo-200 block text-[10px]">Net Take-home</span>
                    <span className="font-extrabold">${selectedEmployee.salary.netSalary}</span>
                  </div>
                </div>
              </div>

              {/* Leave Balances */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-800 text-xs">Leave Balances</h4>
                <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block">Paid Leave</span>
                    <span className="font-bold text-blue-600">
                      {selectedEmployee.leaveBalances.paidTotal - selectedEmployee.leaveBalances.paidUsed} /{' '}
                      {selectedEmployee.leaveBalances.paidTotal}
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block">Sick Leave</span>
                    <span className="font-bold text-rose-600">
                      {selectedEmployee.leaveBalances.sickTotal - selectedEmployee.leaveBalances.sickUsed} /{' '}
                      {selectedEmployee.leaveBalances.sickTotal}
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block">Casual Leave</span>
                    <span className="font-bold text-amber-600">
                      {selectedEmployee.leaveBalances.casualTotal - selectedEmployee.leaveBalances.casualUsed} /{' '}
                      {selectedEmployee.leaveBalances.casualTotal}
                    </span>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              {selectedEmployee.emergencyContact && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <span className="text-[11px] text-slate-400 block">Emergency Contact</span>
                  <p className="font-semibold text-slate-800 mt-0.5">
                    {selectedEmployee.emergencyContact.name} ({selectedEmployee.emergencyContact.relation}) •{' '}
                    {selectedEmployee.emergencyContact.phone}
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
              <button
                onClick={() => setSelectedEmployee(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white">
              <h3 className="font-bold text-base">Register New Employee</h3>
              <p className="text-xs text-slate-300">Creates verified credentials & salary structure in DayFlow database.</p>
            </div>

            <form onSubmit={handleAddEmployee} className="p-5 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Jordan Matthews"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Work Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jordan.m@dayflow.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as Department)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product Design">Product Design</option>
                    <option value="Product">Product</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Designation / Title</label>
                  <input
                    type="text"
                    required
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Senior Frontend Engineer"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Employee ID (Optional)</label>
                  <input
                    type="text"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    placeholder="EMP-1025 (Auto-generated)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 234-5678"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              {/* Salary settings */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block">Initial Compensation Model</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-500 block">Basic Salary ($)</label>
                    <input
                      type="number"
                      value={basicSalary}
                      onChange={(e) => setBasicSalary(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block">Allowances ($)</label>
                    <input
                      type="number"
                      value={allowance}
                      onChange={(e) => setAllowance(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20"
                >
                  Register Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
