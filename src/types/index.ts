export type Role = 'admin' | 'employee';

export type Department =
  | 'Engineering'
  | 'Product Design'
  | 'Product'
  | 'Marketing'
  | 'Finance'
  | 'Human Resources'
  | 'Operations'
  | 'Legal'
  | 'General';

export interface User {
  id: string;
  employeeId: string;
  email: string;
  fullName: string;
  role: Role;
  avatarUrl: string;
  department: string;
  designation: string;
  phone?: string;
  address?: string;
  joiningDate?: string;
  manager?: string;
  isActive: boolean;
  createdAt: string;
}

export interface SalaryBreakdown {
  basic: number;
  allowance: number;
  deductions: number;
  tax: number;
  netSalary: number;
}

export interface EmployeeDocument {
  id: string;
  title: string;
  type: 'ID Proof' | 'Contract' | 'Tax Form' | 'Certificate' | 'Resume';
  fileName: string;
  uploadedAt: string;
  fileSize: string;
  status: 'Verified' | 'Pending Review' | 'Submitted';
}

export interface Employee {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  department: string;
  designation: string;
  joiningDate: string;
  manager: string;
  status: 'Active' | 'On Leave' | 'Probation' | 'Inactive';
  avatarUrl: string;
  salary: SalaryBreakdown;
  documents: EmployeeDocument[];
}

export type AttendanceStatus = 'Present' | 'Late' | 'Half-day' | 'Absent' | 'Leave';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string; // YYYY-MM-DD
  checkIn: string | null; // HH:mm
  checkOut: string | null; // HH:mm
  workingHours: number;
  status: AttendanceStatus;
  notes?: string;
  location: 'HQ Office' | 'Remote - Home' | 'Client Site';
  anomalyFlag?: boolean;
  anomalyReason?: string;
}

export type LeaveType = 'Paid Leave' | 'Sick Leave' | 'Casual Leave' | 'Unpaid Leave';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveBalance {
  paidTotal: number;
  paidUsed: number;
  sickTotal: number;
  sickUsed: number;
  casualTotal: number;
  casualUsed: number;
  unpaidUsed: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  avatarUrl?: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  status: LeaveStatus;
  appliedAt: string;
  reviewedBy?: string;
  reviewerComment?: string;
  reviewedAt?: string;
}

export interface PayrollRecord {
  id: string;
  slipNumber: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  month: string; // e.g. "August 2026"
  payPeriod: string; // e.g. "01 Aug 2026 - 31 Aug 2026"
  basicSalary: number;
  allowance: number;
  bonus: number;
  overtimePay: number;
  deductions: number;
  tax: number;
  netSalary: number;
  payDate: string;
  status: 'Paid' | 'Processing' | 'Pending';
  bankAccount: string;
}

export interface WellbeingCheckin {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  workloadRating: number; // 1-5
  energyRating: number; // 1-5
  stressRating: number; // 1-5
  satisfactionRating: number; // 1-5
  needsSupport: boolean;
  feedbackNote?: string;
  overallScore: number; // 0-100
  statusLevel: 'Thriving' | 'Balanced' | 'Moderate Strain' | 'Elevated Burnout Risk';
  aiTip: string;
}

export interface AIProductivityFactor {
  name: string;
  impact: 'positive' | 'negative' | 'neutral';
  score: number; // e.g. +12% or -8%
  description: string;
}

export interface AIInsight {
  employeeId: string;
  employeeName: string;
  department: string;
  productivityScore: number; // 0-100
  attendanceScore: number; // 0-100
  engagementScore: number; // 0-100
  burnoutRisk: 'Low' | 'Moderate' | 'High';
  workloadLevel: 'Low' | 'Optimal' | 'Heavy' | 'Overloaded';
  attendanceRisk: 'Low' | 'Medium' | 'High';
  predictedWeeklyOutput: number; // e.g. 88%
  keyFactors: AIProductivityFactor[];
  actionableRecommendation: string;
  wellbeingSummary: string;
  lastEvaluated: string;
}

export interface NotificationItem {
  id: string;
  recipientId: string; // 'all' | 'admin' | employeeId
  title: string;
  message: string;
  type: 'leave' | 'attendance' | 'payroll' | 'wellbeing' | 'announcement' | 'ai';
  isRead: boolean;
  timestamp: string;
  actionUrl?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  category?: string;
  metadata?: {
    type?: 'stat' | 'leave_summary' | 'attendance_chart' | 'recommendation';
    data?: any;
  };
}
