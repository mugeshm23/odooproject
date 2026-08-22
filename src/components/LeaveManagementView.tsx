import React, { useState } from 'react';
import {
  CalendarDays,
  PlusCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Calendar,
  User,
  Sparkles,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { store } from '../services/store';
import { LeaveRequest, LeaveType, User as UserType } from '../types';

interface LeaveManagementViewProps {
  currentUser: UserType;
}

export const LeaveManagementView: React.FC<LeaveManagementViewProps> = ({ currentUser }) => {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [leaveType, setLeaveType] = useState<LeaveType>('Paid Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Pending' | 'Approved' | 'Rejected'>('all');
  const [reviewModalRequest, setReviewModalRequest] = useState<LeaveRequest | null>(null);
  const [reviewDecision, setReviewDecision] = useState<'Approved' | 'Rejected'>('Approved');
  const [reviewerComment, setReviewerComment] = useState('');

  const isAdmin = currentUser.role === 'admin';
  const balances = store.getLeaveBalances(currentUser.employeeId);
  const leaveRequests = store.getLeaveRequests(isAdmin ? undefined : currentUser.employeeId);

  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) return 1;
    const diff = Math.abs(end.getTime() - start.getTime());
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1);
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason.trim()) return;

    store.applyLeave({
      employeeId: currentUser.employeeId,
      leaveType,
      startDate,
      endDate,
      reason: reason.trim()
    });

    setShowApplyModal(false);
    setStartDate('');
    setEndDate('');
    setReason('');
  };

  const handleReviewSubmit = () => {
    if (!reviewModalRequest) return;
    store.reviewLeaveRequest(
      reviewModalRequest.id,
      reviewDecision,
      reviewerComment || (reviewDecision === 'Approved' ? 'Approved by HR.' : 'Request could not be accommodated.'),
      currentUser.fullName
    );
    setReviewModalRequest(null);
    setReviewerComment('');
  };

  const filteredLeaves = leaveRequests.filter((l) => {
    if (statusFilter !== 'all' && l.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Leave Management & Approvals</h1>
          <p className="text-xs text-slate-500">
            {isAdmin ? 'Review workforce time-off requests and department coverage' : 'Track your leave balances and submit time-off applications'}
          </p>
        </div>

        {!isAdmin && (
          <button
            onClick={() => setShowApplyModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Apply for Time Off</span>
          </button>
        )}
      </div>

      {/* Leave Balances Grid (For Employee) */}
      {!isAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Paid Leave (Annual)</span>
              <span className="p-1.5 rounded-md bg-blue-50 text-blue-600 text-xs font-bold">Annual</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{balances.paidTotal - balances.paidUsed}</span>
              <span className="text-xs text-slate-500">of {balances.paidTotal} Days</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                style={{ width: `${(balances.paidUsed / balances.paidTotal) * 100}%` }}
                className="h-full bg-blue-600 rounded-full"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Sick Leave</span>
              <span className="p-1.5 rounded-md bg-rose-50 text-rose-600 text-xs font-bold">Medical</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{balances.sickTotal - balances.sickUsed}</span>
              <span className="text-xs text-slate-500">of {balances.sickTotal} Days</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                style={{ width: `${(balances.sickUsed / balances.sickTotal) * 100}%` }}
                className="h-full bg-rose-500 rounded-full"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Casual Leave</span>
              <span className="p-1.5 rounded-md bg-amber-50 text-amber-600 text-xs font-bold">Personal</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{balances.casualTotal - balances.casualUsed}</span>
              <span className="text-xs text-slate-500">of {balances.casualTotal} Days</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                style={{ width: `${(balances.casualUsed / balances.casualTotal) * 100}%` }}
                className="h-full bg-amber-500 rounded-full"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Unpaid Leave</span>
              <span className="p-1.5 rounded-md bg-slate-100 text-slate-600 text-xs font-bold">Special</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{balances.unpaidUsed}</span>
              <span className="text-xs text-slate-500">Days Taken</span>
            </div>
            <p className="text-[11px] text-slate-400">Subject to manager approval</p>
          </div>
        </div>
      )}

      {/* Requests Queue / Table */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <h2 className="font-bold text-sm text-slate-900">
            {isAdmin ? 'All Workforce Leave Applications' : 'My Leave Request History'}
          </h2>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Filter:</span>
            <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-medium">
              {(['all', 'Pending', 'Approved', 'Rejected'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-md transition-colors capitalize ${
                    statusFilter === st ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredLeaves.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No leave requests matching your current status filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Employee</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Dates</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Reviewer Notes</th>
                  {isAdmin && <th className="p-3 text-right">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeaves.map((req) => (
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
                          <span className="text-[10px] text-slate-400">{req.department}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-semibold text-slate-800">{req.leaveType}</td>
                    <td className="p-3 text-slate-700 whitespace-nowrap">
                      {req.startDate} <span className="text-slate-400">→</span> {req.endDate}
                    </td>
                    <td className="p-3 font-bold text-slate-800">{req.daysCount} Day(s)</td>
                    <td className="p-3 max-w-xs text-slate-600 truncate" title={req.reason}>
                      {req.reason}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          req.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : req.status === 'Pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 max-w-xs truncate">
                      {req.reviewerComment ? (
                        <span className="italic text-slate-700">"{req.reviewerComment}"</span>
                      ) : (
                        <span className="text-slate-400">--</span>
                      )}
                    </td>
                    {isAdmin && (
                      <td className="p-3 text-right">
                        {req.status === 'Pending' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setReviewModalRequest(req);
                                setReviewDecision('Approved');
                              }}
                              className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px]"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                setReviewModalRequest(req);
                                setReviewDecision('Rejected');
                              }}
                              className="px-2.5 py-1 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-[11px]"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-medium">Resolved</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Apply Leave Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white">
              <h3 className="font-bold text-base">Submit Time-Off Request</h3>
              <p className="text-xs text-slate-300">Request will be sent to HR & team lead for approval.</p>
            </div>

            <form onSubmit={handleApply} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Paid Leave">Paid Leave (Annual Balance: {balances.paidTotal - balances.paidUsed} days)</option>
                  <option value="Sick Leave">Sick Leave (Medical Balance: {balances.sickTotal - balances.sickUsed} days)</option>
                  <option value="Casual Leave">Casual Leave (Personal Balance: {balances.casualTotal - balances.casualUsed} days)</option>
                  <option value="Unpaid Leave">Unpaid Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              {startDate && endDate && (
                <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-900 text-xs font-medium">
                  Total Duration: <strong>{calculateDays()} Day(s)</strong>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason / Purpose</label>
                <textarea
                  required
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Attending family function and scheduled doctor visit"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal (For Admin) */}
      {reviewModalRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white">
              <h3 className="font-bold text-base">HR Review: {reviewModalRequest.employeeName}</h3>
              <p className="text-xs text-slate-300">
                {reviewModalRequest.leaveType} ({reviewModalRequest.daysCount} days, {reviewModalRequest.startDate} to {reviewModalRequest.endDate})
              </p>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Employee Reason:</span>
                <p className="font-medium text-slate-800 mt-0.5">{reviewModalRequest.reason}</p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Decision</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setReviewDecision('Approved')}
                    className={`py-2 rounded-xl font-bold border transition-colors ${
                      reviewDecision === 'Approved'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    ✓ Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewDecision('Rejected')}
                    className={`py-2 rounded-xl font-bold border transition-colors ${
                      reviewDecision === 'Rejected'
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    ✕ Reject
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">HR Note / Feedback</label>
                <input
                  type="text"
                  value={reviewerComment}
                  onChange={(e) => setReviewerComment(e.target.value)}
                  placeholder={reviewDecision === 'Approved' ? 'e.g. Approved. Enjoy your time off!' : 'e.g. Schedule conflicts with audit.'}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReviewModalRequest(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReviewSubmit}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20"
                >
                  Confirm Decision
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
