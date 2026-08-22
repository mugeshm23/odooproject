import {
  User,
  Employee,
  AttendanceRecord,
  LeaveRequest,
  LeaveBalance,
  PayrollRecord,
  WellbeingCheckin,
  AIInsight,
  NotificationItem
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_admin',
    employeeId: 'ADM-001',
    email: 'admin@dayflow.com',
    fullName: 'Sarah Jenkins',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    department: 'Human Resources',
    designation: 'VP of People & Culture',
    phone: '+1 (555) 234-5678',
    address: '100 Innovation Way, Suite 400, San Francisco, CA',
    joiningDate: '2022-01-15',
    manager: 'CEO Office',
    isActive: true,
    createdAt: '2022-01-15T09:00:00Z'
  },
  {
    id: 'usr_emp1',
    employeeId: 'EMP-1001',
    email: 'employee@dayflow.com',
    fullName: 'Alex Morgan',
    role: 'employee',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Engineering',
    designation: 'Senior Frontend Engineer',
    phone: '+1 (555) 345-6789',
    address: '42 Market Street, Apt 8B, San Francisco, CA',
    joiningDate: '2023-03-10',
    manager: 'Jordan Lee (DevOps & Tech Lead)',
    isActive: true,
    createdAt: '2023-03-10T09:00:00Z'
  },
  {
    id: 'usr_emp2',
    employeeId: 'EMP-1002',
    email: 'priya.sharma@dayflow.com',
    fullName: 'Priya Sharma',
    role: 'employee',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    department: 'Engineering',
    designation: 'Staff Backend Architect',
    phone: '+1 (555) 456-7890',
    address: '88 Tech Blvd, Redwood City, CA',
    joiningDate: '2022-08-01',
    manager: 'Jordan Lee',
    isActive: true,
    createdAt: '2022-08-01T09:00:00Z'
  },
  {
    id: 'usr_emp3',
    employeeId: 'EMP-1003',
    email: 'david.kim@dayflow.com',
    fullName: 'David Kim',
    role: 'employee',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'Product Design',
    designation: 'Lead Product Designer',
    phone: '+1 (555) 567-8901',
    address: '15 Mission District, San Francisco, CA',
    joiningDate: '2023-01-20',
    manager: 'Sophia Chen',
    isActive: true,
    createdAt: '2023-01-20T09:00:00Z'
  },
  {
    id: 'usr_emp4',
    employeeId: 'EMP-1004',
    email: 'elena.rostova@dayflow.com',
    fullName: 'Elena Rostova',
    role: 'employee',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    department: 'Human Resources',
    designation: 'Talent Acquisition Lead',
    phone: '+1 (555) 678-9012',
    address: '74 Pine St, Oakland, CA',
    joiningDate: '2023-05-15',
    manager: 'Sarah Jenkins',
    isActive: true,
    createdAt: '2023-05-15T09:00:00Z'
  },
  {
    id: 'usr_emp5',
    employeeId: 'EMP-1005',
    email: 'marcus.vance@dayflow.com',
    fullName: 'Marcus Vance',
    role: 'employee',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    department: 'Finance',
    designation: 'Senior Financial Analyst',
    phone: '+1 (555) 789-0123',
    address: '220 Montgomery St, San Francisco, CA',
    joiningDate: '2022-11-01',
    manager: 'CFO Office',
    isActive: true,
    createdAt: '2022-11-01T09:00:00Z'
  },
  {
    id: 'usr_emp6',
    employeeId: 'EMP-1006',
    email: 'maya.patel@dayflow.com',
    fullName: 'Maya Patel',
    role: 'employee',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    department: 'Marketing',
    designation: 'Growth Marketing Director',
    phone: '+1 (555) 890-1234',
    address: '500 Howard St, San Francisco, CA',
    joiningDate: '2023-02-01',
    manager: 'CMO Office',
    isActive: true,
    createdAt: '2023-02-01T09:00:00Z'
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'usr_emp1',
    employeeId: 'EMP-1001',
    fullName: 'Alex Morgan',
    email: 'employee@dayflow.com',
    phone: '+1 (555) 345-6789',
    address: '42 Market Street, Apt 8B, San Francisco, CA',
    department: 'Engineering',
    designation: 'Senior Frontend Engineer',
    joiningDate: '2023-03-10',
    manager: 'Jordan Lee (DevOps & Tech Lead)',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    salary: {
      basic: 7500,
      allowance: 1800,
      deductions: 650,
      tax: 1150,
      netSalary: 7500
    },
    documents: [
      { id: 'doc_1', title: 'Employment Agreement 2023-2026', type: 'Contract', fileName: 'Alex_Morgan_Employment_Contract.pdf', uploadedAt: '2023-03-10', fileSize: '2.4 MB', status: 'Verified' },
      { id: 'doc_2', title: 'W-4 Federal Tax Declaration', type: 'Tax Form', fileName: 'Alex_Morgan_W4_2026.pdf', uploadedAt: '2026-01-05', fileSize: '850 KB', status: 'Verified' },
      { id: 'doc_3', title: 'Government ID & Passport Record', type: 'ID Proof', fileName: 'Gov_ID_Passport_Alex.pdf', uploadedAt: '2023-03-08', fileSize: '1.2 MB', status: 'Verified' }
    ]
  },
  {
    id: 'usr_emp2',
    employeeId: 'EMP-1002',
    fullName: 'Priya Sharma',
    email: 'priya.sharma@dayflow.com',
    phone: '+1 (555) 456-7890',
    address: '88 Tech Blvd, Redwood City, CA',
    department: 'Engineering',
    designation: 'Staff Backend Architect',
    joiningDate: '2022-08-01',
    manager: 'Jordan Lee',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    salary: {
      basic: 9200,
      allowance: 2200,
      deductions: 750,
      tax: 1550,
      netSalary: 9100
    },
    documents: [
      { id: 'doc_4', title: 'Senior Staff Employment Agreement', type: 'Contract', fileName: 'Priya_Sharma_Staff_Contract.pdf', uploadedAt: '2022-08-01', fileSize: '2.1 MB', status: 'Verified' },
      { id: 'doc_5', title: 'AWS Solutions Architect Professional', type: 'Certificate', fileName: 'AWS_SAP_Cert_Priya.pdf', uploadedAt: '2024-06-12', fileSize: '1.5 MB', status: 'Verified' }
    ]
  },
  {
    id: 'usr_emp3',
    employeeId: 'EMP-1003',
    fullName: 'David Kim',
    email: 'david.kim@dayflow.com',
    phone: '+1 (555) 567-8901',
    address: '15 Mission District, San Francisco, CA',
    department: 'Product Design',
    designation: 'Lead Product Designer',
    joiningDate: '2023-01-20',
    manager: 'Sophia Chen',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    salary: {
      basic: 7200,
      allowance: 1600,
      deductions: 550,
      tax: 1050,
      netSalary: 7200
    },
    documents: [
      { id: 'doc_6', title: 'Design Lead Contract', type: 'Contract', fileName: 'David_Kim_Contract.pdf', uploadedAt: '2023-01-20', fileSize: '1.9 MB', status: 'Verified' }
    ]
  },
  {
    id: 'usr_emp4',
    employeeId: 'EMP-1004',
    fullName: 'Elena Rostova',
    email: 'elena.rostova@dayflow.com',
    phone: '+1 (555) 678-9012',
    address: '74 Pine St, Oakland, CA',
    department: 'Human Resources',
    designation: 'Talent Acquisition Lead',
    joiningDate: '2023-05-15',
    manager: 'Sarah Jenkins',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    salary: {
      basic: 6500,
      allowance: 1400,
      deductions: 500,
      tax: 900,
      netSalary: 6500
    },
    documents: [
      { id: 'doc_7', title: 'Talent Acquisition Offer Letter', type: 'Contract', fileName: 'Elena_Offer_Letter.pdf', uploadedAt: '2023-05-15', fileSize: '1.8 MB', status: 'Verified' }
    ]
  },
  {
    id: 'usr_emp5',
    employeeId: 'EMP-1005',
    fullName: 'Marcus Vance',
    email: 'marcus.vance@dayflow.com',
    phone: '+1 (555) 789-0123',
    address: '220 Montgomery St, San Francisco, CA',
    department: 'Finance',
    designation: 'Senior Financial Analyst',
    joiningDate: '2022-11-01',
    manager: 'CFO Office',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    salary: {
      basic: 7800,
      allowance: 1700,
      deductions: 600,
      tax: 1200,
      netSalary: 7700
    },
    documents: [
      { id: 'doc_8', title: 'Financial Analyst Employment Package', type: 'Contract', fileName: 'Marcus_Vance_Contract.pdf', uploadedAt: '2022-11-01', fileSize: '2.0 MB', status: 'Verified' }
    ]
  },
  {
    id: 'usr_emp6',
    employeeId: 'EMP-1006',
    fullName: 'Maya Patel',
    email: 'maya.patel@dayflow.com',
    phone: '+1 (555) 890-1234',
    address: '500 Howard St, San Francisco, CA',
    department: 'Marketing',
    designation: 'Growth Marketing Director',
    joiningDate: '2023-02-01',
    manager: 'CMO Office',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    salary: {
      basic: 8400,
      allowance: 1900,
      deductions: 680,
      tax: 1350,
      netSalary: 8270
    },
    documents: [
      { id: 'doc_9', title: 'Marketing Director Agreement', type: 'Contract', fileName: 'Maya_Patel_Contract.pdf', uploadedAt: '2023-02-01', fileSize: '2.3 MB', status: 'Verified' }
    ]
  },
  {
    id: 'usr_emp7',
    employeeId: 'EMP-1007',
    fullName: 'Jordan Lee',
    email: 'jordan.lee@dayflow.com',
    phone: '+1 (555) 901-2345',
    address: '333 Bush St, San Francisco, CA',
    department: 'Engineering',
    designation: 'DevOps & Cloud Lead',
    joiningDate: '2021-09-15',
    manager: 'VP Engineering',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    salary: {
      basic: 9500,
      allowance: 2400,
      deductions: 800,
      tax: 1650,
      netSalary: 9450
    },
    documents: [
      { id: 'doc_10', title: 'Lead Architect Agreement', type: 'Contract', fileName: 'Jordan_Lee_Contract.pdf', uploadedAt: '2021-09-15', fileSize: '2.2 MB', status: 'Verified' }
    ]
  },
  {
    id: 'usr_emp8',
    employeeId: 'EMP-1008',
    fullName: 'Sophia Chen',
    email: 'sophia.chen@dayflow.com',
    phone: '+1 (555) 012-3456',
    address: '128 Battery St, San Francisco, CA',
    department: 'Product',
    designation: 'Senior Product Manager',
    joiningDate: '2022-04-10',
    manager: 'CPO Office',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=150&auto=format&fit=crop&q=80',
    salary: {
      basic: 8200,
      allowance: 1800,
      deductions: 620,
      tax: 1300,
      netSalary: 8080
    },
    documents: [
      { id: 'doc_11', title: 'Product Manager Agreement', type: 'Contract', fileName: 'Sophia_Chen_Contract.pdf', uploadedAt: '2022-04-10', fileSize: '1.9 MB', status: 'Verified' }
    ]
  }
];

export const INITIAL_LEAVE_BALANCES: Record<string, LeaveBalance> = {
  'EMP-1001': { paidTotal: 18, paidUsed: 4, sickTotal: 10, sickUsed: 2, casualTotal: 6, casualUsed: 1, unpaidUsed: 0 },
  'EMP-1002': { paidTotal: 20, paidUsed: 8, sickTotal: 10, sickUsed: 3, casualTotal: 6, casualUsed: 2, unpaidUsed: 0 },
  'EMP-1003': { paidTotal: 18, paidUsed: 6, sickTotal: 10, sickUsed: 1, casualTotal: 6, casualUsed: 0, unpaidUsed: 0 },
  'EMP-1004': { paidTotal: 16, paidUsed: 3, sickTotal: 10, sickUsed: 0, casualTotal: 6, casualUsed: 2, unpaidUsed: 0 },
  'EMP-1005': { paidTotal: 18, paidUsed: 5, sickTotal: 10, sickUsed: 4, casualTotal: 6, casualUsed: 1, unpaidUsed: 0 },
  'EMP-1006': { paidTotal: 20, paidUsed: 7, sickTotal: 10, sickUsed: 2, casualTotal: 6, casualUsed: 3, unpaidUsed: 0 },
  'EMP-1007': { paidTotal: 22, paidUsed: 10, sickTotal: 10, sickUsed: 1, casualTotal: 6, casualUsed: 2, unpaidUsed: 0 },
  'EMP-1008': { paidTotal: 18, paidUsed: 4, sickTotal: 10, sickUsed: 2, casualTotal: 6, casualUsed: 1, unpaidUsed: 0 }
};

export const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'lr_101',
    employeeId: 'EMP-1001',
    employeeName: 'Alex Morgan',
    department: 'Engineering',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    leaveType: 'Paid Leave',
    startDate: '2026-09-01',
    endDate: '2026-09-04',
    daysCount: 4,
    reason: 'Attending annual Frontend Architect Conference and family vacation.',
    status: 'Pending',
    appliedAt: '2026-08-20T14:30:00Z'
  },
  {
    id: 'lr_102',
    employeeId: 'EMP-1003',
    employeeName: 'David Kim',
    department: 'Product Design',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    leaveType: 'Sick Leave',
    startDate: '2026-08-25',
    endDate: '2026-08-26',
    daysCount: 2,
    reason: 'Scheduled dental procedure and recovery period.',
    status: 'Pending',
    appliedAt: '2026-08-21T09:15:00Z'
  },
  {
    id: 'lr_103',
    employeeId: 'EMP-1002',
    employeeName: 'Priya Sharma',
    department: 'Engineering',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    leaveType: 'Paid Leave',
    startDate: '2026-07-15',
    endDate: '2026-07-20',
    daysCount: 5,
    reason: 'Summer break with family.',
    status: 'Approved',
    appliedAt: '2026-07-01T11:00:00Z',
    reviewedBy: 'Sarah Jenkins (HR)',
    reviewerComment: 'Approved. Enjoy your time off!',
    reviewedAt: '2026-07-02T16:00:00Z'
  },
  {
    id: 'lr_104',
    employeeId: 'EMP-1006',
    employeeName: 'Maya Patel',
    department: 'Marketing',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    leaveType: 'Casual Leave',
    startDate: '2026-08-10',
    endDate: '2026-08-10',
    daysCount: 1,
    reason: 'Personal family matter.',
    status: 'Approved',
    appliedAt: '2026-08-05T08:30:00Z',
    reviewedBy: 'Sarah Jenkins (HR)',
    reviewerComment: 'Approved.',
    reviewedAt: '2026-08-05T10:00:00Z'
  },
  {
    id: 'lr_105',
    employeeId: 'EMP-1005',
    employeeName: 'Marcus Vance',
    department: 'Finance',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    leaveType: 'Unpaid Leave',
    startDate: '2026-06-01',
    endDate: '2026-06-05',
    daysCount: 5,
    reason: 'Emergency extended travel.',
    status: 'Rejected',
    appliedAt: '2026-05-25T13:00:00Z',
    reviewedBy: 'Sarah Jenkins (HR)',
    reviewerComment: 'Conflict with fiscal audit close. Please reschedule after audit week.',
    reviewedAt: '2026-05-26T09:30:00Z'
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  // Today's attendance for Alex Morgan
  {
    id: 'att_today_1001',
    employeeId: 'EMP-1001',
    employeeName: 'Alex Morgan',
    department: 'Engineering',
    date: '2026-08-21',
    checkIn: '08:58',
    checkOut: null,
    workingHours: 7.6,
    status: 'Present',
    location: 'HQ Office',
    notes: 'Working on DayFlow UI components & frontend microservices'
  },
  {
    id: 'att_today_1002',
    employeeId: 'EMP-1002',
    employeeName: 'Priya Sharma',
    department: 'Engineering',
    date: '2026-08-21',
    checkIn: '09:02',
    checkOut: null,
    workingHours: 7.5,
    status: 'Present',
    location: 'Remote - Home',
    notes: 'PostgreSQL database sharding optimization'
  },
  {
    id: 'att_today_1003',
    employeeId: 'EMP-1003',
    employeeName: 'David Kim',
    department: 'Product Design',
    date: '2026-08-21',
    checkIn: '09:35',
    checkOut: null,
    workingHours: 6.9,
    status: 'Late',
    location: 'HQ Office',
    notes: 'Delayed due to transit delay. Working on high fidelity design tokens.',
    anomalyFlag: true,
    anomalyReason: '3rd late check-in within 10 work days (9:35 AM)'
  },
  {
    id: 'att_today_1004',
    employeeId: 'EMP-1004',
    employeeName: 'Elena Rostova',
    department: 'Human Resources',
    date: '2026-08-21',
    checkIn: '08:45',
    checkOut: null,
    workingHours: 7.8,
    status: 'Present',
    location: 'HQ Office',
    notes: 'Conducting candidate interviews for Staff Data Engineer'
  },
  {
    id: 'att_today_1005',
    employeeId: 'EMP-1005',
    employeeName: 'Marcus Vance',
    department: 'Finance',
    date: '2026-08-21',
    checkIn: null,
    checkOut: null,
    workingHours: 0,
    status: 'Absent',
    location: 'HQ Office',
    notes: 'Unplanned absence - HR notified',
    anomalyFlag: true,
    anomalyReason: 'Unplanned absence on Friday without prior leave request'
  },
  {
    id: 'att_today_1006',
    employeeId: 'EMP-1006',
    employeeName: 'Maya Patel',
    department: 'Marketing',
    date: '2026-08-21',
    checkIn: '09:00',
    checkOut: null,
    workingHours: 7.5,
    status: 'Present',
    location: 'Remote - Home'
  },
  {
    id: 'att_today_1007',
    employeeId: 'EMP-1007',
    employeeName: 'Jordan Lee',
    department: 'Engineering',
    date: '2026-08-21',
    checkIn: '08:30',
    checkOut: null,
    workingHours: 8.0,
    status: 'Present',
    location: 'HQ Office'
  },
  {
    id: 'att_today_1008',
    employeeId: 'EMP-1008',
    employeeName: 'Sophia Chen',
    department: 'Product',
    date: '2026-08-21',
    checkIn: '08:50',
    checkOut: null,
    workingHours: 7.7,
    status: 'Present',
    location: 'HQ Office'
  },
  // Past historical records for Alex Morgan
  { id: 'att_hist_1', employeeId: 'EMP-1001', employeeName: 'Alex Morgan', department: 'Engineering', date: '2026-08-20', checkIn: '09:00', checkOut: '17:45', workingHours: 8.75, status: 'Present', location: 'HQ Office' },
  { id: 'att_hist_2', employeeId: 'EMP-1001', employeeName: 'Alex Morgan', department: 'Engineering', date: '2026-08-19', checkIn: '08:55', checkOut: '18:10', workingHours: 9.25, status: 'Present', location: 'HQ Office', notes: 'Sprint release overtime (1.25 hrs)' },
  { id: 'att_hist_3', employeeId: 'EMP-1001', employeeName: 'Alex Morgan', department: 'Engineering', date: '2026-08-18', checkIn: '08:50', checkOut: '17:30', workingHours: 8.66, status: 'Present', location: 'Remote - Home' },
  { id: 'att_hist_4', employeeId: 'EMP-1001', employeeName: 'Alex Morgan', department: 'Engineering', date: '2026-08-17', checkIn: '09:12', checkOut: '17:30', workingHours: 8.3, status: 'Present', location: 'Remote - Home' },
  { id: 'att_hist_5', employeeId: 'EMP-1001', employeeName: 'Alex Morgan', department: 'Engineering', date: '2026-08-14', checkIn: '09:00', checkOut: '17:00', workingHours: 8.0, status: 'Present', location: 'HQ Office' },
  { id: 'att_hist_6', employeeId: 'EMP-1001', employeeName: 'Alex Morgan', department: 'Engineering', date: '2026-08-13', checkIn: '08:45', checkOut: '18:00', workingHours: 9.25, status: 'Present', location: 'HQ Office' },
  { id: 'att_hist_7', employeeId: 'EMP-1001', employeeName: 'Alex Morgan', department: 'Engineering', date: '2026-08-12', checkIn: '09:30', checkOut: '17:30', workingHours: 8.0, status: 'Late', location: 'Remote - Home', notes: 'Traffic delay' },
  { id: 'att_hist_8', employeeId: 'EMP-1001', employeeName: 'Alex Morgan', department: 'Engineering', date: '2026-08-11', checkIn: '08:55', checkOut: '17:15', workingHours: 8.33, status: 'Present', location: 'HQ Office' },
  { id: 'att_hist_9', employeeId: 'EMP-1001', employeeName: 'Alex Morgan', department: 'Engineering', date: '2026-08-10', checkIn: '09:05', checkOut: '17:30', workingHours: 8.4, status: 'Present', location: 'HQ Office' }
];

export const INITIAL_PAYROLL: PayrollRecord[] = [
  {
    id: 'pay_aug_1001',
    slipNumber: 'SLIP-2026-08-1001',
    employeeId: 'EMP-1001',
    employeeName: 'Alex Morgan',
    department: 'Engineering',
    designation: 'Senior Frontend Engineer',
    month: 'August 2026',
    payPeriod: '01 Aug 2026 - 31 Aug 2026',
    basicSalary: 7500,
    allowance: 1800,
    bonus: 500,
    overtimePay: 350,
    deductions: 650,
    tax: 1150,
    netSalary: 8350,
    payDate: '2026-08-31',
    status: 'Paid',
    bankAccount: 'Chase Bank •••• 4912'
  },
  {
    id: 'pay_jul_1001',
    slipNumber: 'SLIP-2026-07-1001',
    employeeId: 'EMP-1001',
    employeeName: 'Alex Morgan',
    department: 'Engineering',
    designation: 'Senior Frontend Engineer',
    month: 'July 2026',
    payPeriod: '01 Jul 2026 - 31 Jul 2026',
    basicSalary: 7500,
    allowance: 1800,
    bonus: 0,
    overtimePay: 200,
    deductions: 650,
    tax: 1120,
    netSalary: 7730,
    payDate: '2026-07-31',
    status: 'Paid',
    bankAccount: 'Chase Bank •••• 4912'
  },
  {
    id: 'pay_aug_1002',
    slipNumber: 'SLIP-2026-08-1002',
    employeeId: 'EMP-1002',
    employeeName: 'Priya Sharma',
    department: 'Engineering',
    designation: 'Staff Backend Architect',
    month: 'August 2026',
    payPeriod: '01 Aug 2026 - 31 Aug 2026',
    basicSalary: 9200,
    allowance: 2200,
    bonus: 800,
    overtimePay: 0,
    deductions: 750,
    tax: 1650,
    netSalary: 9800,
    payDate: '2026-08-31',
    status: 'Paid',
    bankAccount: 'Wells Fargo •••• 8821'
  },
  {
    id: 'pay_aug_1003',
    slipNumber: 'SLIP-2026-08-1003',
    employeeId: 'EMP-1003',
    employeeName: 'David Kim',
    department: 'Product Design',
    designation: 'Lead Product Designer',
    month: 'August 2026',
    payPeriod: '01 Aug 2026 - 31 Aug 2026',
    basicSalary: 7200,
    allowance: 1600,
    bonus: 0,
    overtimePay: 150,
    deductions: 550,
    tax: 1050,
    netSalary: 7350,
    payDate: '2026-08-31',
    status: 'Paid',
    bankAccount: 'Bank of America •••• 3340'
  },
  {
    id: 'pay_aug_1004',
    slipNumber: 'SLIP-2026-08-1004',
    employeeId: 'EMP-1004',
    employeeName: 'Elena Rostova',
    department: 'Human Resources',
    designation: 'Talent Acquisition Lead',
    month: 'August 2026',
    payPeriod: '01 Aug 2026 - 31 Aug 2026',
    basicSalary: 6500,
    allowance: 1400,
    bonus: 600,
    overtimePay: 0,
    deductions: 500,
    tax: 950,
    netSalary: 7050,
    payDate: '2026-08-31',
    status: 'Paid',
    bankAccount: 'Citibank •••• 9012'
  }
];

export const INITIAL_WELLBEING_LOGS: WellbeingCheckin[] = [
  {
    id: 'wb_1',
    employeeId: 'EMP-1001',
    employeeName: 'Alex Morgan',
    date: '2026-08-21',
    workloadRating: 4,
    energyRating: 4,
    stressRating: 2,
    satisfactionRating: 5,
    needsSupport: false,
    feedbackNote: 'Great sprint velocity this week. Making swift progress on DayFlow UI.',
    overallScore: 84,
    statusLevel: 'Thriving',
    aiTip: 'Your energy and engagement are strong. Maintain your structured focus blocks and scheduled hydration breaks.'
  },
  {
    id: 'wb_2',
    employeeId: 'EMP-1001',
    employeeName: 'Alex Morgan',
    date: '2026-08-19',
    workloadRating: 4,
    energyRating: 3,
    stressRating: 3,
    satisfactionRating: 4,
    needsSupport: false,
    feedbackNote: 'Overtime hours on Wednesday created minor fatigue.',
    overallScore: 72,
    statusLevel: 'Balanced',
    aiTip: 'Overtime workload noted. Consider stepping away from screens for a 15-minute afternoon walk.'
  },
  {
    id: 'wb_3',
    employeeId: 'EMP-1003',
    employeeName: 'David Kim',
    date: '2026-08-20',
    workloadRating: 5,
    energyRating: 2,
    stressRating: 4,
    satisfactionRating: 3,
    needsSupport: true,
    feedbackNote: 'Design sprint deadlines overlapping with multiple design reviews.',
    overallScore: 48,
    statusLevel: 'Moderate Strain',
    aiTip: 'Workload strain detected. Recommend staggering review deliverables and discussing scope with Product lead.'
  },
  {
    id: 'wb_4',
    employeeId: 'EMP-1002',
    employeeName: 'Priya Sharma',
    date: '2026-08-21',
    workloadRating: 3,
    energyRating: 4,
    stressRating: 2,
    satisfactionRating: 5,
    needsSupport: false,
    feedbackNote: 'Smooth database migration without downtime.',
    overallScore: 88,
    statusLevel: 'Thriving',
    aiTip: 'Excellent balance observed. Your consistent work hours support sustained cognitive performance.'
  }
];

export const INITIAL_AI_INSIGHTS: Record<string, AIInsight> = {
  'EMP-1001': {
    employeeId: 'EMP-1001',
    employeeName: 'Alex Morgan',
    department: 'Engineering',
    productivityScore: 86,
    attendanceScore: 94,
    engagementScore: 90,
    burnoutRisk: 'Low',
    workloadLevel: 'Optimal',
    attendanceRisk: 'Low',
    predictedWeeklyOutput: 92,
    keyFactors: [
      { name: 'On-Time Attendance Rate', impact: 'positive', score: 14, description: '94% punctual check-ins over the last 30 work days.' },
      { name: 'Sprint Task Velocity', impact: 'positive', score: 12, description: 'Completing 4.2 story points per day with low defect turnaround.' },
      { name: 'Wellbeing Pulse Index', impact: 'positive', score: 8, description: 'Average wellbeing score of 84/100 indicates thriving sentiment.' },
      { name: 'Overtime Spike Alert', impact: 'negative', score: -6, description: '3.5 hours overtime recorded across sprint finalization.' }
    ],
    actionableRecommendation: 'Alex demonstrates strong sustained output. Encourage taking scheduled leave in September to prevent post-launch fatigue.',
    wellbeingSummary: 'Energy and job satisfaction are elevated. Workload is manageable with healthy recovery periods.',
    lastEvaluated: '2026-08-21T08:00:00Z'
  },
  'EMP-1002': {
    employeeId: 'EMP-1002',
    employeeName: 'Priya Sharma',
    department: 'Engineering',
    productivityScore: 92,
    attendanceScore: 98,
    engagementScore: 95,
    burnoutRisk: 'Low',
    workloadLevel: 'Optimal',
    attendanceRisk: 'Low',
    predictedWeeklyOutput: 96,
    keyFactors: [
      { name: 'Architectural Delivery', impact: 'positive', score: 18, description: 'Led zero-downtime database optimization seamlessly.' },
      { name: 'Attendance Consistency', impact: 'positive', score: 15, description: '98% punctual attendance across hybrid schedule.' },
      { name: 'Peer Collaboration', impact: 'positive', score: 10, description: 'Conducted 12 high-quality PR code reviews this month.' }
    ],
    actionableRecommendation: 'High performer ready for expanded technical leadership or engineering mentorship responsibilities.',
    wellbeingSummary: 'Excellent mental agility and steady schedule.',
    lastEvaluated: '2026-08-21T08:00:00Z'
  },
  'EMP-1003': {
    employeeId: 'EMP-1003',
    employeeName: 'David Kim',
    department: 'Product Design',
    productivityScore: 74,
    attendanceScore: 82,
    engagementScore: 70,
    burnoutRisk: 'Moderate',
    workloadLevel: 'Heavy',
    attendanceRisk: 'Medium',
    predictedWeeklyOutput: 76,
    keyFactors: [
      { name: 'Concurrent Design Reviews', impact: 'negative', score: -14, description: 'Managing 6 overlapping UI sprint requests simultaneously.' },
      { name: 'Late Arrival Cluster', impact: 'negative', score: -10, description: '3 late check-ins recorded this month.' },
      { name: 'Creative Output Quality', impact: 'positive', score: 15, description: 'High Figma component adoption across engineering.' }
    ],
    actionableRecommendation: 'Workload load-balancing recommended. Reassign 2 junior design tasks or grant flex-time to mitigate burnout.',
    wellbeingSummary: 'Self-reported stress level is 4/5 with elevated fatigue. Proactive HR check-in advised.',
    lastEvaluated: '2026-08-21T08:00:00Z'
  },
  'EMP-1005': {
    employeeId: 'EMP-1005',
    employeeName: 'Marcus Vance',
    department: 'Finance',
    productivityScore: 68,
    attendanceScore: 76,
    engagementScore: 65,
    burnoutRisk: 'High',
    workloadLevel: 'Overloaded',
    attendanceRisk: 'High',
    predictedWeeklyOutput: 70,
    keyFactors: [
      { name: 'Unplanned Absences', impact: 'negative', score: -18, description: '2 unplanned absences during fiscal close month.' },
      { name: 'Audit Crunch Overtime', impact: 'negative', score: -12, description: 'Exceeded 12 hours overtime during quarterly audit.' },
      { name: 'Financial Model Accuracy', impact: 'positive', score: 10, description: 'Zero variance in cash-flow projections.' }
    ],
    actionableRecommendation: 'Immediate workload review required. Audit crunch fatigue detected; consider temporary contractor support.',
    wellbeingSummary: 'High burnout risk indicator triggered. Suggest 1:1 conversation with HR officer.',
    lastEvaluated: '2026-08-21T08:00:00Z'
  }
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    recipientId: 'EMP-1001',
    title: 'Salary Credited',
    message: 'Your salary for August 2026 ($8,350.00) has been processed and deposited.',
    type: 'payroll',
    isRead: false,
    timestamp: '2026-08-21T09:00:00Z',
    actionUrl: 'payroll'
  },
  {
    id: 'notif_2',
    recipientId: 'EMP-1001',
    title: 'AI Wellbeing Pulse Ready',
    message: 'Your weekly productivity score is 86/100! Tap to view personalized work rhythm insights.',
    type: 'ai',
    isRead: false,
    timestamp: '2026-08-21T08:30:00Z',
    actionUrl: 'wellbeing'
  },
  {
    id: 'notif_3',
    recipientId: 'admin',
    title: 'New Leave Request (Alex Morgan)',
    message: 'Alex Morgan submitted a 4-day Paid Leave request for Sept 01 - Sept 04.',
    type: 'leave',
    isRead: false,
    timestamp: '2026-08-20T14:30:00Z',
    actionUrl: 'leave'
  },
  {
    id: 'notif_4',
    recipientId: 'admin',
    title: 'Attendance Anomaly Detected',
    message: 'Marcus Vance marked unplanned absent today. Anomaly alert registered in HR monitor.',
    type: 'attendance',
    isRead: false,
    timestamp: '2026-08-21T09:45:00Z',
    actionUrl: 'attendance'
  },
  {
    id: 'notif_5',
    recipientId: 'all',
    title: 'Company All-Hands Meeting',
    message: 'Quarterly All-Hands with Leadership is scheduled for Thursday at 3:00 PM PST in Room Olympus & Zoom.',
    type: 'announcement',
    isRead: true,
    timestamp: '2026-08-19T10:00:00Z'
  }
];
