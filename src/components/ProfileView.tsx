import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Building,
  Calendar,
  CreditCard,
  HeartPulse,
  Shield,
  Edit2,
  CheckCircle2,
  Lock,
  Download,
  MapPin
} from 'lucide-react';
import { store } from '../services/store';
import { User as UserType } from '../types';
import { generateSalarySlipPDF } from '../services/pdfGenerator';

interface ProfileViewProps {
  currentUser: UserType;
  onUpdateUser?: (updated: UserType) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ currentUser, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState(currentUser.phone || '+1 (555) 349-2910');
  const [emergencyName, setEmergencyName] = useState('Elena Vance');
  const [emergencyPhone, setEmergencyPhone] = useState('+1 (555) 902-8321');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const employee = store.getEmployeeById(currentUser.employeeId);
  const balances = store.getLeaveBalances(currentUser.employeeId);
  const latestPayroll = store.getPayroll(currentUser.employeeId)[0];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateProfile(currentUser.employeeId, {
      phone,
      emergencyContact: {
        name: emergencyName,
        relation: 'Spouse / Family',
        phone: emergencyPhone
      }
    });

    if (onUpdateUser) {
      onUpdateUser({
        ...currentUser,
        phone
      });
    }

    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleDownloadSlip = () => {
    if (latestPayroll) {
      generateSalarySlipPDF(latestPayroll, employee);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Employee Profile & Workspace Record</h1>
          <p className="text-xs text-slate-500">Verified employment identity, compensation details, and emergency contacts</p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Profile Info</span>
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
          >
            Cancel
          </button>
        )}
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {/* Main Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 relative">
          <div className="absolute -bottom-10 left-6">
            <img
              src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
              alt={currentUser.fullName}
              className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md"
            />
          </div>
        </div>

        {/* Header Details */}
        <div className="pt-12 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{currentUser.fullName}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-100 text-indigo-800">
                  {currentUser.role === 'admin' ? 'HR / Administrator' : 'Staff Employee'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">{currentUser.designation || 'Specialist'}</p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-mono font-semibold bg-slate-100 px-2.5 py-1 rounded-md text-slate-800">
                ID: {currentUser.employeeId}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                Active
              </span>
            </div>
          </div>

          {/* Details Grid or Edit Form */}
          {!isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-[11px] text-slate-400">
                  Employment Details
                </h3>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      Department
                    </span>
                    <span className="font-bold text-slate-800">{currentUser.department}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Date of Joining
                    </span>
                    <span className="font-medium text-slate-800">{employee?.joiningDate || 'Jan 15, 2024'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      Primary Location
                    </span>
                    <span className="font-medium text-slate-800">HQ Campus (Hybrid)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-[11px] text-slate-400">
                  Contact & Emergency
                </h3>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      Work Email
                    </span>
                    <span className="font-medium text-slate-800">{currentUser.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      Mobile Phone
                    </span>
                    <span className="font-medium text-slate-800">{phone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <HeartPulse className="w-3.5 h-3.5 text-slate-400" />
                      Emergency
                    </span>
                    <span className="font-medium text-slate-800">
                      {emergencyName} ({emergencyPhone})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4 text-xs">
              <h3 className="font-bold text-slate-800">Edit Contact & Emergency Information</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Phone</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Emergency Contact Name</label>
                  <input
                    type="text"
                    required
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Emergency Contact Phone</label>
                <input
                  type="text"
                  required
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-2xs"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Compensation & Payslip Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              <h2 className="font-bold text-sm text-slate-900">Current Compensation Structure</h2>
            </div>
            {latestPayroll && (
              <button
                onClick={handleDownloadSlip}
                className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold border border-indigo-200 flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Latest PDF Slip</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-400 block">Base Salary</span>
              <span className="text-base font-bold text-slate-900">${employee?.salary.basic.toLocaleString() || '7,500'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-400 block">Allowances</span>
              <span className="text-base font-bold text-emerald-600">+${employee?.salary.allowance.toLocaleString() || '1,800'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-400 block">Deductions</span>
              <span className="text-base font-bold text-rose-600">-${employee?.salary.deductions.toLocaleString() || '650'}</span>
            </div>
            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
              <span className="text-[11px] text-indigo-700 font-semibold block">Net Salary</span>
              <span className="text-base font-extrabold text-indigo-900">
                ${employee?.salary.netSalary.toLocaleString() || '7,500'}
              </span>
            </div>
          </div>
        </div>

        {/* Leave Balances Quick Card */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h2 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">Available Time-Off</h2>

          <div className="space-y-2.5 text-xs">
            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-slate-600">Paid Leave</span>
                <span className="font-bold text-blue-600">
                  {balances.paidTotal - balances.paidUsed} / {balances.paidTotal} Days Left
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  style={{ width: `${(balances.paidUsed / balances.paidTotal) * 100}%` }}
                  className="h-full bg-blue-600"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-slate-600">Sick Leave</span>
                <span className="font-bold text-rose-600">
                  {balances.sickTotal - balances.sickUsed} / {balances.sickTotal} Days Left
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  style={{ width: `${(balances.sickUsed / balances.sickTotal) * 100}%` }}
                  className="h-full bg-rose-500"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-slate-600">Casual Leave</span>
                <span className="font-bold text-amber-600">
                  {balances.casualTotal - balances.casualUsed} / {balances.casualTotal} Days Left
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  style={{ width: `${(balances.casualUsed / balances.casualTotal) * 100}%` }}
                  className="h-full bg-amber-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
