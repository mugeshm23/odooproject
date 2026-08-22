import React from 'react';
import {
  Sparkles,
  Shield,
  Clock,
  CalendarCheck,
  CreditCard,
  HeartPulse,
  LineChart,
  ArrowRight,
  CheckCircle2,
  Users,
  Zap,
  Award,
  Lock,
  Cpu
} from 'lucide-react';

interface LandingPageProps {
  onLoginDemo: (role: 'admin' | 'employee') => void;
  onOpenLoginModal: () => void;
  onOpenSignupModal: () => void;
  onOpenZipModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLoginDemo,
  onOpenLoginModal,
  onOpenSignupModal,
  onOpenZipModal
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 text-white shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight text-white">DAYFLOW</span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  AI HRMS
                </span>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#ai-engine" className="hover:text-white transition-colors">DayFlow AI</a>
            <a href="#architecture" className="hover:text-white transition-colors">Tech Stack</a>
            <a href="#demo-credentials" className="hover:text-white transition-colors">Demo Logins</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenLoginModal}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onOpenSignupModal}
              className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-lg shadow-md shadow-indigo-600/25 transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-blue-500/15 to-transparent blur-3xl -z-10 pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto px-6 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-semibold text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            <span>Hackathon Edition • Scikit-learn + FastAPI + PostgreSQL Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Every workday, <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-indigo-300 to-blue-500">
              perfectly aligned.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-300 font-normal leading-relaxed">
            An intelligent, AI-powered Human Resource Management System connecting people, productivity, wellbeing, attendance, and payroll into one unified enterprise platform.
          </p>

          {/* Quick Demo Launch Buttons */}
          <div id="demo-credentials" className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onLoginDemo('employee')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2.5 transition-all group"
            >
              <span>Launch Demo as Employee</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onLoginDemo('admin')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-semibold text-sm flex items-center justify-center gap-2.5 transition-all"
            >
              <Shield className="w-4 h-4 text-indigo-400" />
              <span>Launch Demo as HR Admin</span>
            </button>
            <button
              onClick={onOpenZipModal}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium text-sm flex items-center justify-center gap-2 transition-all"
            >
              <span>Download Full ZIP Package</span>
            </button>
          </div>

          {/* Demo Credentials Pill */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 max-w-xl mx-auto text-xs text-slate-400 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <span className="font-bold text-slate-200 block mb-0.5">👤 Demo Employee Account:</span>
              <span>employee@dayflow.com</span>
              <span className="text-slate-500 block">Password: Employee@123</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <span className="font-bold text-slate-200 block mb-0.5">🛡️ Demo HR Admin Account:</span>
              <span>admin@dayflow.com</span>
              <span className="text-slate-500 block">Password: Admin@123</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section id="features" className="py-20 bg-slate-900/40 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">Enterprise HR Suite</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Designed for modern teams & people leaders
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Eliminate disconnected spreadsheets and legacy software with an integrated, intelligent employee experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Smart Attendance & Anomaly Detection</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                One-tap check-in with GPS/office verification, automatic working hour computation, and anomaly flagging for late clusters or unplanned absences.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Leave Management & Fast Approvals</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automated balances for Paid, Sick, Casual, and Unpaid leave. Instant HR review drawer with comments and real-time dashboard notifications.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Payroll & PDF Salary Slips</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Clear earnings, allowances, bonus, overtime, and tax deductions with single-click official PDF payslip download and disbursement tracking.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">DayFlow AI Productivity Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Trained Random Forest ML scoring model with explainable factor breakdowns (attendance rate, sprint velocity, overtime strain, recovery index).
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Employee Wellbeing Assistant</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                5-question daily pulse check-in to track energy, workload, and stress trends. Non-discriminatory decision-support suggestions for healthy balance.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <LineChart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Reports & Workforce Analytics</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Interactive departmental charts, monthly attendance trends, overtime analysis, and one-click CSV & printable report export for leadership.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Differentiation Section */}
      <section id="ai-engine" className="py-20 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
              <Cpu className="w-3.5 h-3.5" />
              <span>Responsible Decision-Support AI</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
              DayFlow AI: Explainable intelligence, zero discrimination.
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Unlike generic black-box algorithms, DayFlow AI delivers transparent, factor-level explanations for every productivity score and burnout risk indicator.
            </p>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Ethical Guardrails:</strong> Never evaluates protected demographic attributes. Focuses purely on operational factors like workload hours and rest intervals.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Decision-Support Only:</strong> Positioned strictly as an advisory companion for humans, never making automated personnel decisions.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Interactive AI Copilot:</strong> Chat with DayFlow AI to ask about your leaves, attendance stats, burnout risks, or departmental summaries.</span>
              </div>
            </div>
          </div>

          {/* AI Mock Card Preview */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">DayFlow AI Workforce Analysis</h4>
                  <p className="text-[11px] text-slate-400">Scikit-learn Model: RandomForestRegressor</p>
                </div>
              </div>
              <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Score: 86 / 100
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Burnout Risk</span>
                <span className="font-bold text-emerald-400 text-sm">Low (Optimal)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Attendance Score</span>
                <span className="font-bold text-blue-400 text-sm">94 / 100</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Explainable Factors</span>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs flex justify-between items-center">
                <span className="text-slate-300">On-Time Consistency</span>
                <span className="text-emerald-400 font-bold">+14% impact</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs flex justify-between items-center">
                <span className="text-slate-300">Sprint Overtime Fatigue</span>
                <span className="text-rose-400 font-bold">-6% impact</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/50 text-xs text-indigo-200">
              💡 <strong>AI Recommendation:</strong> "Alex demonstrates sustained output. Encourage taking scheduled leave in September to prevent launch fatigue."
            </div>
          </div>
        </div>
      </section>

      {/* Full Architecture & Tech Stack */}
      <section id="architecture" className="py-20 bg-slate-900/60 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-sky-400">Technical Foundation</p>
            <h2 className="text-3xl font-bold text-white tracking-tight">Full-Stack Hackathon Architecture</h2>
            <p className="text-slate-400 text-sm">Engineered with high performance Python FastAPI, PostgreSQL, and Scikit-learn.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-sm text-indigo-400 block">Python Backend</span>
              <p className="text-slate-400">FastAPI, Pydantic v2, SQLAlchemy ORM, JWT security, and Uvicorn ASGI server.</p>
            </div>
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-sm text-emerald-400 block">Database Layer</span>
              <p className="text-slate-400">PostgreSQL relational schema with foreign key constraints, indexes, and full DDL.</p>
            </div>
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-sm text-sky-400 block">Machine Learning</span>
              <p className="text-slate-400">Scikit-learn RandomForest model, feature engineering pipelines, and Joblib serialization.</p>
            </div>
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-sm text-purple-400 block">Frontend UX</span>
              <p className="text-slate-400">High-contrast clean SaaS layout, real-time reactive sync, jsPDF payslip builder.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800/80 bg-slate-950 text-center text-xs text-slate-500 space-y-3">
        <p>© 2026 DayFlow HRMS Systems. Built for Innovation & Hackathon Excellence.</p>
        <p className="text-slate-600">Every workday, perfectly aligned.</p>
      </footer>
    </div>
  );
};
