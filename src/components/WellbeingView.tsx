import React, { useState } from 'react';
import {
  HeartPulse,
  Sparkles,
  Smile,
  Meh,
  Frown,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  Coffee,
  Sun,
  Activity,
  MessageCircle
} from 'lucide-react';
import { store } from '../services/store';
import { User as UserType } from '../types';
import confetti from 'canvas-confetti';

interface WellbeingViewProps {
  currentUser: UserType;
}

export const WellbeingView: React.FC<WellbeingViewProps> = ({ currentUser }) => {
  const [workloadRating, setWorkloadRating] = useState(3);
  const [energyRating, setEnergyRating] = useState(4);
  const [stressRating, setStressRating] = useState(2);
  const [satisfactionRating, setSatisfactionRating] = useState(4);
  const [needsSupport, setNeedsSupport] = useState(false);
  const [feedbackNote, setFeedbackNote] = useState('');
  const [submittedCheckin, setSubmittedCheckin] = useState<boolean>(false);

  const isAdmin = currentUser.role === 'admin';
  const wellbeingLogs = store.getWellbeingLogs(isAdmin ? undefined : currentUser.employeeId);
  const latestLog = wellbeingLogs[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    store.submitWellbeingCheckin({
      employeeId: currentUser.employeeId,
      workloadRating,
      energyRating,
      stressRating,
      satisfactionRating,
      needsSupport,
      feedbackNote: feedbackNote.trim()
    });

    setSubmittedCheckin(true);
    try {
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
    } catch {}
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">DayFlow AI Wellbeing & Wellness Pulse</h1>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-100 text-rose-800">
              Responsible AI
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {isAdmin
              ? 'Aggregated workforce sentiment and early burnout risk detection'
              : 'Daily 1-minute check-in for workload alignment, energy tracking, and supportive guidance'}
          </p>
        </div>
      </div>

      {/* Main Check-in Card (For Employee) */}
      {!isAdmin && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-slate-900">Daily 5-Factor Wellness Check-in</h2>
                <p className="text-[11px] text-slate-500">Responses calibrate your personal DayFlow AI productivity rhythm</p>
              </div>
            </div>
            {latestLog && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                Last Score: {latestLog.overallScore}/100 ({latestLog.statusLevel})
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            {/* 1. Workload */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-slate-800">1. How is your workload today?</label>
                <span className="font-bold text-indigo-700">
                  {workloadRating === 1
                    ? '1 - Very Light'
                    : workloadRating === 2
                      ? '2 - Manageable'
                      : workloadRating === 3
                        ? '3 - Balanced'
                        : workloadRating === 4
                          ? '4 - Heavy'
                          : '5 - Overwhelming'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={workloadRating}
                onChange={(e) => setWorkloadRating(Number(e.target.value))}
                className="w-full accent-indigo-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
            </div>

            {/* 2. Energy */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-slate-800">2. What is your energy level right now?</label>
                <span className="font-bold text-emerald-600">
                  {energyRating === 1
                    ? '1 - Exhausted'
                    : energyRating === 2
                      ? '2 - Low'
                      : energyRating === 3
                        ? '3 - Moderate'
                        : energyRating === 4
                          ? '4 - High'
                          : '5 - Peak Vitality'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={energyRating}
                onChange={(e) => setEnergyRating(Number(e.target.value))}
                className="w-full accent-emerald-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
            </div>

            {/* 3. Stress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-slate-800">3. How much work-related stress do you feel?</label>
                <span className="font-bold text-rose-600">
                  {stressRating === 1
                    ? '1 - Very Low / Calm'
                    : stressRating === 2
                      ? '2 - Mild'
                      : stressRating === 3
                        ? '3 - Moderate'
                        : stressRating === 4
                          ? '4 - Elevated'
                          : '5 - Severe Strain'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={stressRating}
                onChange={(e) => setStressRating(Number(e.target.value))}
                className="w-full accent-rose-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
            </div>

            {/* 4. Satisfaction */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-slate-800">4. How fulfilled are you with your recent contributions?</label>
                <span className="font-bold text-blue-600">
                  {satisfactionRating === 1
                    ? '1 - Frustrated'
                    : satisfactionRating === 2
                      ? '2 - Low'
                      : satisfactionRating === 3
                        ? '3 - Satisfied'
                        : satisfactionRating === 4
                          ? '4 - Highly Engaged'
                          : '5 - Deeply Fulfilled'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={satisfactionRating}
                onChange={(e) => setSatisfactionRating(Number(e.target.value))}
                className="w-full accent-blue-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
            </div>

            {/* 5. Support Request Checkbox */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={needsSupport}
                  onChange={(e) => setNeedsSupport(e.target.checked)}
                  className="rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>5. I would appreciate discussing workload priorities or scheduling a support check-in.</span>
              </label>
            </div>

            {/* Feedback Note */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Optional context for yourself / HR advisor</label>
              <input
                type="text"
                value={feedbackNote}
                onChange={(e) => setFeedbackNote(e.target.value)}
                placeholder="e.g. Completing major sprint release; schedule looks balanced next week."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Log Daily Pulse & Update AI Guidance</span>
            </button>
          </form>
        </div>
      )}

      {/* Supportive AI Wellness Guidance Card */}
      {latestLog && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white border border-slate-800 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-white/10 text-sky-300">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm">DayFlow AI Wellness Companion</h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Status: {latestLog.statusLevel}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed italic">
            "{latestLog.aiTip}"
          </p>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <span>Logged on {latestLog.date}</span>
            <span>Overall Wellbeing Score: {latestLog.overallScore} / 100</span>
          </div>
        </div>
      )}

      {/* Historical Wellbeing Logs Table */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <h2 className="font-bold text-sm text-slate-900">
          {isAdmin ? 'Workforce Wellbeing History' : 'My Historical Wellbeing Check-ins'}
        </h2>

        {wellbeingLogs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No check-ins recorded yet. Fill out the pulse form above to start tracking!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Date</th>
                  {isAdmin && <th className="p-3">Employee</th>}
                  <th className="p-3">Overall Score</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Energy / Stress</th>
                  <th className="p-3">Support Requested</th>
                  <th className="p-3">AI Wellness Tip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {wellbeingLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-semibold text-slate-800 whitespace-nowrap">{log.date}</td>
                    {isAdmin && <td className="p-3 font-bold text-slate-900">{log.employeeName}</td>}
                    <td className="p-3 font-extrabold text-indigo-700 text-sm">{log.overallScore}/100</td>
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          log.statusLevel === 'Thriving'
                            ? 'bg-emerald-100 text-emerald-800'
                            : log.statusLevel === 'Balanced'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {log.statusLevel}
                      </span>
                    </td>
                    <td className="p-3 text-slate-700">
                      Energy: {log.energyRating}/5 • Stress: {log.stressRating}/5
                    </td>
                    <td className="p-3">
                      {log.needsSupport ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          Yes - Flagged
                        </span>
                      ) : (
                        <span className="text-slate-400">No</span>
                      )}
                    </td>
                    <td className="p-3 max-w-xs text-slate-600 truncate" title={log.aiTip}>
                      {log.aiTip}
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
