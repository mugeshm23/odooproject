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
import {
  INITIAL_USERS,
  INITIAL_EMPLOYEES,
  INITIAL_ATTENDANCE,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_LEAVE_BALANCES,
  INITIAL_PAYROLL,
  INITIAL_WELLBEING_LOGS,
  INITIAL_AI_INSIGHTS,
  INITIAL_NOTIFICATIONS
} from '../data/seedData';

class DataStore {
  private users: User[] = [];
  private employees: Employee[] = [];
  private attendance: AttendanceRecord[] = [];
  private leaveRequests: LeaveRequest[] = [];
  private leaveBalances: Record<string, LeaveBalance> = {};
  private payroll: PayrollRecord[] = [];
  private wellbeingLogs: WellbeingCheckin[] = [];
  private aiInsights: Record<string, AIInsight> = {};
  private notifications: NotificationItem[] = [];
  private currentUser: User | null = null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadState();
  }

  private loadState() {
    try {
      const savedUsers = localStorage.getItem('dayflow_users');
      const savedEmployees = localStorage.getItem('dayflow_employees');
      const savedAttendance = localStorage.getItem('dayflow_attendance');
      const savedLeaves = localStorage.getItem('dayflow_leaves');
      const savedBalances = localStorage.getItem('dayflow_balances');
      const savedPayroll = localStorage.getItem('dayflow_payroll');
      const savedWellbeing = localStorage.getItem('dayflow_wellbeing');
      const savedAi = localStorage.getItem('dayflow_ai');
      const savedNotifs = localStorage.getItem('dayflow_notifs');
      const savedUser = localStorage.getItem('dayflow_current_user');

      this.users = savedUsers ? JSON.parse(savedUsers) : [...INITIAL_USERS];
      this.employees = savedEmployees ? JSON.parse(savedEmployees) : [...INITIAL_EMPLOYEES];
      this.attendance = savedAttendance ? JSON.parse(savedAttendance) : [...INITIAL_ATTENDANCE];
      this.leaveRequests = savedLeaves ? JSON.parse(savedLeaves) : [...INITIAL_LEAVE_REQUESTS];
      this.leaveBalances = savedBalances ? JSON.parse(savedBalances) : { ...INITIAL_LEAVE_BALANCES };
      this.payroll = savedPayroll ? JSON.parse(savedPayroll) : [...INITIAL_PAYROLL];
      this.wellbeingLogs = savedWellbeing ? JSON.parse(savedWellbeing) : [...INITIAL_WELLBEING_LOGS];
      this.aiInsights = savedAi ? JSON.parse(savedAi) : { ...INITIAL_AI_INSIGHTS };
      this.notifications = savedNotifs ? JSON.parse(savedNotifs) : [...INITIAL_NOTIFICATIONS];
      this.currentUser = savedUser ? JSON.parse(savedUser) : this.users[1]; // default to Alex Morgan (Employee) or Admin
    } catch {
      this.users = [...INITIAL_USERS];
      this.employees = [...INITIAL_EMPLOYEES];
      this.attendance = [...INITIAL_ATTENDANCE];
      this.leaveRequests = [...INITIAL_LEAVE_REQUESTS];
      this.leaveBalances = { ...INITIAL_LEAVE_BALANCES };
      this.payroll = [...INITIAL_PAYROLL];
      this.wellbeingLogs = [...INITIAL_WELLBEING_LOGS];
      this.aiInsights = { ...INITIAL_AI_INSIGHTS };
      this.notifications = [...INITIAL_NOTIFICATIONS];
      this.currentUser = this.users[1];
    }
  }

  public saveState() {
    try {
      localStorage.setItem('dayflow_users', JSON.stringify(this.users));
      localStorage.setItem('dayflow_employees', JSON.stringify(this.employees));
      localStorage.setItem('dayflow_attendance', JSON.stringify(this.attendance));
      localStorage.setItem('dayflow_leaves', JSON.stringify(this.leaveRequests));
      localStorage.setItem('dayflow_balances', JSON.stringify(this.leaveBalances));
      localStorage.setItem('dayflow_payroll', JSON.stringify(this.payroll));
      localStorage.setItem('dayflow_wellbeing', JSON.stringify(this.wellbeingLogs));
      localStorage.setItem('dayflow_ai', JSON.stringify(this.aiInsights));
      localStorage.setItem('dayflow_notifs', JSON.stringify(this.notifications));
      if (this.currentUser) {
        localStorage.setItem('dayflow_current_user', JSON.stringify(this.currentUser));
      } else {
        localStorage.removeItem('dayflow_current_user');
      }
    } catch {
      // Storage error safeguard
    }
    this.notify();
  }

  public subscribe(fn: () => void) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  // Auth & Current User
  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public setCurrentUser(user: User | null) {
    this.currentUser = user;
    this.saveState();
  }

  public login(email: string, role?: 'admin' | 'employee'): { success: boolean; user?: User; error?: string } {
    const cleanEmail = email.trim().toLowerCase();
    const user = this.users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      // If demo mode or test email, create or fallback
      if (cleanEmail === 'admin@dayflow.com') {
        const adminUser = this.users.find((u) => u.role === 'admin') || this.users[0];
        this.setCurrentUser(adminUser);
        return { success: true, user: adminUser };
      }
      if (cleanEmail === 'employee@dayflow.com') {
        const empUser = this.users.find((u) => u.employeeId === 'EMP-1001') || this.users[1];
        this.setCurrentUser(empUser);
        return { success: true, user: empUser };
      }
      return { success: false, error: 'Invalid email or password. Please check your credentials.' };
    }

    if (role && user.role !== role) {
      return { success: false, error: `Account exists but role is ${user.role}. Please select the correct portal.` };
    }

    this.setCurrentUser(user);
    return { success: true, user };
  }

  public signup(data: {
    fullName: string;
    email: string;
    employeeId: string;
    role: 'admin' | 'employee';
    department?: string;
    designation?: string;
  }): { success: boolean; user?: User; error?: string } {
    const cleanEmail = data.email.trim().toLowerCase();
    if (this.users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      employeeId: data.employeeId || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      email: cleanEmail,
      fullName: data.fullName,
      role: data.role,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.fullName)}`,
      department: data.department || (data.role === 'admin' ? 'Human Resources' : 'Engineering'),
      designation: data.designation || (data.role === 'admin' ? 'HR Specialist' : 'Software Engineer'),
      isActive: true,
      createdAt: new Date().toISOString()
    };

    this.users.push(newUser);

    if (newUser.role === 'employee') {
      const newEmp: Employee = {
        id: newUser.id,
        employeeId: newUser.employeeId,
        fullName: newUser.fullName,
        email: newUser.email,
        phone: '+1 (555) 000-0000',
        address: 'HQ Campus, San Francisco, CA',
        department: newUser.department,
        designation: newUser.designation,
        joiningDate: new Date().toISOString().split('T')[0],
        manager: 'Sarah Jenkins',
        status: 'Active',
        avatarUrl: newUser.avatarUrl,
        salary: {
          basic: 7000,
          allowance: 1500,
          deductions: 500,
          tax: 1000,
          netSalary: 7000
        },
        documents: [
          {
            id: `doc_${Date.now()}`,
            title: 'Offer Letter & Onboarding Package',
            type: 'Contract',
            fileName: 'DayFlow_Onboarding_Package.pdf',
            uploadedAt: new Date().toISOString().split('T')[0],
            fileSize: '1.4 MB',
            status: 'Verified'
          }
        ]
      };
      this.employees.push(newEmp);

      this.leaveBalances[newUser.employeeId] = {
        paidTotal: 18,
        paidUsed: 0,
        sickTotal: 10,
        sickUsed: 0,
        casualTotal: 6,
        casualUsed: 0,
        unpaidUsed: 0
      };
    }

    this.setCurrentUser(newUser);
    return { success: true, user: newUser };
  }

  public switchRole(role: 'admin' | 'employee'): User {
    let target = this.users.find((u) => u.role === role);
    if (!target) {
      if (role === 'admin') {
        target = this.users.find((u) => u.role === 'admin') || {
          id: 'usr_admin_1',
          employeeId: 'EMP-ADM-01',
          email: 'admin@dayflow.com',
          fullName: 'Sarah Jenkins',
          role: 'admin',
          avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
          department: 'Human Resources',
          designation: 'Head of People & Culture',
          phone: '+1 (555) 300-8800',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z'
        };
      } else {
        target = this.users.find((u) => u.employeeId === 'EMP-1001') || {
          id: 'usr_emp_1',
          employeeId: 'EMP-1001',
          email: 'employee@dayflow.com',
          fullName: 'Jordan Matthews',
          role: 'employee',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          department: 'Engineering',
          designation: 'Staff Software Architect',
          phone: '+1 (555) 349-2910',
          isActive: true,
          createdAt: '2024-01-15T00:00:00Z'
        };
      }
    }
    this.setCurrentUser(target);
    return target;
  }

  public updateProfile(employeeId: string, updates: { phone?: string; address?: string; emergencyContact?: any }): User | null {
    const user = this.users.find((u) => u.employeeId === employeeId);
    if (user) {
      if (updates.phone) user.phone = updates.phone;
      if (updates.address) user.address = updates.address;
    }
    const emp = this.employees.find((e) => e.employeeId === employeeId);
    if (emp) {
      if (updates.phone) emp.phone = updates.phone;
      if (updates.address) emp.address = updates.address;
      if (updates.emergencyContact) (emp as any).emergencyContact = updates.emergencyContact;
    }
    if (this.currentUser && this.currentUser.employeeId === employeeId) {
      this.currentUser = { ...this.currentUser, ...updates };
    }
    this.saveState();
    return this.currentUser;
  }

  public logout() {
    this.setCurrentUser(null);
  }

  // Employees
  public getEmployees(): Employee[] {
    return [...this.employees];
  }

  public getEmployeeById(id: string): Employee | undefined {
    return this.employees.find((e) => e.id === id || e.employeeId === id);
  }

  public addEmployee(employee: Partial<Employee>): Employee {
    const id = `usr_emp_${Date.now()}`;
    const employeeId = employee.employeeId || `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newEmp: Employee = {
      id,
      employeeId,
      fullName: employee.fullName || 'New Employee',
      email: employee.email || `${employeeId.toLowerCase()}@dayflow.com`,
      phone: employee.phone || '+1 (555) 123-4567',
      address: employee.address || 'San Francisco, CA',
      department: employee.department || 'Engineering',
      designation: employee.designation || 'Software Engineer',
      joiningDate: employee.joiningDate || new Date().toISOString().split('T')[0],
      manager: employee.manager || 'Sarah Jenkins',
      status: employee.status || 'Active',
      avatarUrl:
        employee.avatarUrl ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(employee.fullName || 'User')}`,
      salary: employee.salary || {
        basic: 7000,
        allowance: 1500,
        deductions: 500,
        tax: 1000,
        netSalary: 7000
      },
      documents: employee.documents || [
        {
          id: `doc_${Date.now()}`,
          title: 'Employment Agreement',
          type: 'Contract',
          fileName: 'DayFlow_Agreement.pdf',
          uploadedAt: new Date().toISOString().split('T')[0],
          fileSize: '1.2 MB',
          status: 'Verified'
        }
      ]
    };

    this.employees.unshift(newEmp);

    // Also add to users list so they can log in
    if (!this.users.some((u) => u.email === newEmp.email)) {
      this.users.push({
        id: newEmp.id,
        employeeId: newEmp.employeeId,
        email: newEmp.email,
        fullName: newEmp.fullName,
        role: 'employee',
        avatarUrl: newEmp.avatarUrl,
        department: newEmp.department,
        designation: newEmp.designation,
        isActive: true,
        createdAt: new Date().toISOString()
      });
    }

    if (!this.leaveBalances[newEmp.employeeId]) {
      this.leaveBalances[newEmp.employeeId] = {
        paidTotal: 18,
        paidUsed: 0,
        sickTotal: 10,
        sickUsed: 0,
        casualTotal: 6,
        casualUsed: 0,
        unpaidUsed: 0
      };
    }

    this.saveState();
    return newEmp;
  }

  public updateEmployee(id: string, updates: Partial<Employee>): Employee | null {
    const index = this.employees.findIndex((e) => e.id === id || e.employeeId === id);
    if (index === -1) return null;
    this.employees[index] = { ...this.employees[index], ...updates };

    // Update user record too
    const uIndex = this.users.findIndex((u) => u.id === id || u.employeeId === id);
    if (uIndex !== -1) {
      this.users[uIndex] = {
        ...this.users[uIndex],
        fullName: updates.fullName || this.users[uIndex].fullName,
        department: updates.department || this.users[uIndex].department,
        designation: updates.designation || this.users[uIndex].designation,
        avatarUrl: updates.avatarUrl || this.users[uIndex].avatarUrl,
        phone: updates.phone || this.users[uIndex].phone,
        address: updates.address || this.users[uIndex].address
      };
    }

    if (this.currentUser && (this.currentUser.id === id || this.currentUser.employeeId === id)) {
      this.currentUser = { ...this.currentUser, ...this.users[uIndex] };
    }

    this.saveState();
    return this.employees[index];
  }

  public deleteEmployee(id: string): boolean {
    this.employees = this.employees.filter((e) => e.id !== id && e.employeeId !== id);
    this.users = this.users.filter((u) => u.id !== id && u.employeeId !== id);
    this.saveState();
    return true;
  }

  // Attendance
  public getAttendance(filter?: { employeeId?: string; date?: string }): AttendanceRecord[] {
    let list = [...this.attendance];
    if (filter?.employeeId) {
      list = list.filter((a) => a.employeeId === filter.employeeId);
    }
    if (filter?.date) {
      list = list.filter((a) => a.date === filter.date);
    }
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public getTodayAttendance(employeeId: string): AttendanceRecord | undefined {
    const today = new Date().toISOString().split('T')[0];
    return this.attendance.find((a) => a.employeeId === employeeId && a.date === today);
  }

  public checkIn(
    employeeId: string,
    location: 'HQ Office' | 'Remote - Home' | 'Client Site' = 'HQ Office',
    notes?: string
  ): AttendanceRecord {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const checkInTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const isLate = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 15);

    const emp = this.getEmployeeById(employeeId);
    const existing = this.attendance.find((a) => a.employeeId === employeeId && a.date === today);

    if (existing) {
      existing.checkIn = checkInTime;
      existing.status = isLate ? 'Late' : 'Present';
      existing.location = location;
      if (notes) existing.notes = notes;
      this.saveState();
      return existing;
    }

    const newRecord: AttendanceRecord = {
      id: `att_${Date.now()}`,
      employeeId,
      employeeName: emp?.fullName || 'Employee',
      department: emp?.department || 'General',
      date: today,
      checkIn: checkInTime,
      checkOut: null,
      workingHours: 0,
      status: isLate ? 'Late' : 'Present',
      location,
      notes: notes || (isLate ? 'Late check-in recorded' : 'Standard check-in')
    };

    this.attendance.unshift(newRecord);
    this.addNotification({
      recipientId: employeeId,
      title: 'Check-in Recorded',
      message: `You successfully checked in at ${checkInTime} (${location}). Have a productive workday!`,
      type: 'attendance',
      actionUrl: 'attendance'
    });

    this.saveState();
    return newRecord;
  }

  public checkOut(employeeId: string, notes?: string): AttendanceRecord | null {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const checkOutTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    let record = this.attendance.find((a) => a.employeeId === employeeId && a.date === today);
    if (!record) {
      // Create with morning start
      const emp = this.getEmployeeById(employeeId);
      record = {
        id: `att_${Date.now()}`,
        employeeId,
        employeeName: emp?.fullName || 'Employee',
        department: emp?.department || 'General',
        date: today,
        checkIn: '09:00',
        checkOut: checkOutTime,
        workingHours: 8.0,
        status: 'Present',
        location: 'HQ Office',
        notes: notes || 'Day finished'
      };
      this.attendance.unshift(record);
    } else {
      record.checkOut = checkOutTime;
      if (record.checkIn) {
        const [inH, inM] = record.checkIn.split(':').map(Number);
        const [outH, outM] = checkOutTime.split(':').map(Number);
        const diffHrs = Math.max(0, (outH * 60 + outM - (inH * 60 + inM)) / 60);
        record.workingHours = Number(diffHrs.toFixed(2));
      } else {
        record.workingHours = 8.0;
      }
      if (notes) record.notes = notes;
    }

    this.addNotification({
      recipientId: employeeId,
      title: 'Check-out Recorded',
      message: `Checked out at ${checkOutTime}. Total working hours: ${record.workingHours} hrs.`,
      type: 'attendance',
      actionUrl: 'attendance'
    });

    this.saveState();
    return record;
  }

  // Leave Management
  public getLeaveRequests(employeeId?: string): LeaveRequest[] {
    if (employeeId) {
      return this.leaveRequests.filter((l) => l.employeeId === employeeId);
    }
    return [...this.leaveRequests];
  }

  public getLeaveBalances(employeeId: string): LeaveBalance {
    if (!this.leaveBalances[employeeId]) {
      this.leaveBalances[employeeId] = {
        paidTotal: 18,
        paidUsed: 0,
        sickTotal: 10,
        sickUsed: 0,
        casualTotal: 6,
        casualUsed: 0,
        unpaidUsed: 0
      };
    }
    return this.leaveBalances[employeeId];
  }

  public applyLeave(data: {
    employeeId: string;
    leaveType: LeaveRequest['leaveType'];
    startDate: string;
    endDate: string;
    reason: string;
  }): LeaveRequest {
    const emp = this.getEmployeeById(data.employeeId);
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const daysCount = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);

    const newRequest: LeaveRequest = {
      id: `lr_${Date.now()}`,
      employeeId: data.employeeId,
      employeeName: emp?.fullName || 'Employee',
      department: emp?.department || 'General',
      avatarUrl: emp?.avatarUrl,
      leaveType: data.leaveType,
      startDate: data.startDate,
      endDate: data.endDate,
      daysCount,
      reason: data.reason,
      status: 'Pending',
      appliedAt: new Date().toISOString()
    };

    this.leaveRequests.unshift(newRequest);

    // Notify Admin
    this.addNotification({
      recipientId: 'admin',
      title: `New Leave Application (${newRequest.employeeName})`,
      message: `${newRequest.employeeName} requested ${daysCount} days of ${data.leaveType} (${data.startDate} to ${data.endDate}).`,
      type: 'leave',
      actionUrl: 'leave'
    });

    this.saveState();
    return newRequest;
  }

  public reviewLeaveRequest(
    id: string,
    status: 'Approved' | 'Rejected',
    reviewerComment?: string,
    reviewerName = 'Sarah Jenkins (HR Director)'
  ): LeaveRequest | null {
    const req = this.leaveRequests.find((l) => l.id === id);
    if (!req) return null;

    req.status = status;
    req.reviewedBy = reviewerName;
    req.reviewerComment = reviewerComment || (status === 'Approved' ? 'Leave approved.' : 'Request could not be accommodated.');
    req.reviewedAt = new Date().toISOString();

    // Deduct leave balance if approved
    if (status === 'Approved') {
      const balance = this.getLeaveBalances(req.employeeId);
      if (req.leaveType === 'Paid Leave') balance.paidUsed += req.daysCount;
      if (req.leaveType === 'Sick Leave') balance.sickUsed += req.daysCount;
      if (req.leaveType === 'Casual Leave') balance.casualUsed += req.daysCount;
      if (req.leaveType === 'Unpaid Leave') balance.unpaidUsed += req.daysCount;
    }

    // Notify Employee
    this.addNotification({
      recipientId: req.employeeId,
      title: `Leave Request ${status}`,
      message: `Your ${req.daysCount}-day ${req.leaveType} from ${req.startDate} has been ${status.toLowerCase()} by HR. ${req.reviewerComment ? `Note: "${req.reviewerComment}"` : ''}`,
      type: 'leave',
      actionUrl: 'leave'
    });

    this.saveState();
    return req;
  }

  // Payroll
  public getPayroll(employeeId?: string): PayrollRecord[] {
    if (employeeId) {
      return this.payroll.filter((p) => p.employeeId === employeeId);
    }
    return [...this.payroll];
  }

  public getPayrollById(id: string): PayrollRecord | undefined {
    return this.payroll.find((p) => p.id === id || p.slipNumber === id);
  }

  public addPayrollRecord(record: Partial<PayrollRecord>): PayrollRecord {
    const emp = this.getEmployeeById(record.employeeId || '');
    const basic = record.basicSalary || emp?.salary.basic || 7000;
    const allowance = record.allowance || emp?.salary.allowance || 1500;
    const bonus = record.bonus || 0;
    const overtimePay = record.overtimePay || 0;
    const deductions = record.deductions || emp?.salary.deductions || 500;
    const tax = record.tax || emp?.salary.tax || 1000;
    const netSalary = basic + allowance + bonus + overtimePay - deductions - tax;

    const newRecord: PayrollRecord = {
      id: `pay_${Date.now()}`,
      slipNumber: `SLIP-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${record.employeeId || '1001'}`,
      employeeId: record.employeeId || 'EMP-1001',
      employeeName: emp?.fullName || record.employeeName || 'Employee',
      department: emp?.department || record.department || 'General',
      designation: emp?.designation || record.designation || 'Staff',
      month: record.month || 'August 2026',
      payPeriod: record.payPeriod || '01 Aug 2026 - 31 Aug 2026',
      basicSalary: basic,
      allowance,
      bonus,
      overtimePay,
      deductions,
      tax,
      netSalary,
      payDate: record.payDate || new Date().toISOString().split('T')[0],
      status: record.status || 'Paid',
      bankAccount: record.bankAccount || 'Direct Deposit (Verified Account)'
    };

    this.payroll.unshift(newRecord);
    this.addNotification({
      recipientId: newRecord.employeeId,
      title: 'Salary Slip Generated',
      message: `Salary slip for ${newRecord.month} ($${netSalary.toLocaleString()}) is now available for download.`,
      type: 'payroll',
      actionUrl: 'payroll'
    });

    this.saveState();
    return newRecord;
  }

  // Wellbeing
  public getWellbeingLogs(employeeId?: string): WellbeingCheckin[] {
    if (employeeId) {
      return this.wellbeingLogs.filter((w) => w.employeeId === employeeId);
    }
    return [...this.wellbeingLogs];
  }

  public submitWellbeingCheckin(data: {
    employeeId: string;
    workloadRating: number;
    energyRating: number;
    stressRating: number;
    satisfactionRating: number;
    needsSupport: boolean;
    feedbackNote?: string;
  }): WellbeingCheckin {
    const emp = this.getEmployeeById(data.employeeId);
    // Calculate balanced wellbeing score 0-100
    // energy(1-5) + satisfaction(1-5) positive, stress(1-5) + workload(1-5) balanced
    const positiveScore = ((data.energyRating + data.satisfactionRating) / 10) * 60;
    const stressPenalty = ((6 - data.stressRating) / 5) * 25;
    const workloadBalance = (1 - Math.abs(data.workloadRating - 3) / 3) * 15;
    const overallScore = Math.min(100, Math.max(20, Math.round(positiveScore + stressPenalty + workloadBalance)));

    let statusLevel: WellbeingCheckin['statusLevel'] = 'Balanced';
    let aiTip = 'Maintain regular micro-breaks and stay hydrated.';

    if (overallScore >= 80) {
      statusLevel = 'Thriving';
      aiTip = 'Excellent mental energy! Your workflow rhythm is well-optimized. Consider sharing productivity strategies with your team.';
    } else if (overallScore >= 65) {
      statusLevel = 'Balanced';
      aiTip = 'Good sustainable balance. Ensure you disconnect on time this evening to recharge your focus reserves.';
    } else if (overallScore >= 45) {
      statusLevel = 'Moderate Strain';
      aiTip = 'Elevated workload pressure detected. Consider breaking complex projects into smaller milestones and taking an afternoon walk.';
    } else {
      statusLevel = 'Elevated Burnout Risk';
      aiTip = 'High stress indicators flagged. We strongly suggest discussing workload priorities with your lead or scheduling a wellness day off.';
    }

    const checkin: WellbeingCheckin = {
      id: `wb_${Date.now()}`,
      employeeId: data.employeeId,
      employeeName: emp?.fullName || 'Employee',
      date: new Date().toISOString().split('T')[0],
      workloadRating: data.workloadRating,
      energyRating: data.energyRating,
      stressRating: data.stressRating,
      satisfactionRating: data.satisfactionRating,
      needsSupport: data.needsSupport,
      feedbackNote: data.feedbackNote,
      overallScore,
      statusLevel,
      aiTip
    };

    this.wellbeingLogs.unshift(checkin);

    // Update AI Insights for this employee dynamically
    this.refreshAIInsight(data.employeeId, overallScore, data.stressRating, data.workloadRating);

    this.addNotification({
      recipientId: data.employeeId,
      title: 'Wellbeing Check-in Logged',
      message: `Score: ${overallScore}/100 (${statusLevel}). DayFlow AI has updated your wellness guidance.`,
      type: 'wellbeing',
      actionUrl: 'wellbeing'
    });

    this.saveState();
    return checkin;
  }

  // AI Insights
  public getAIInsights(employeeId?: string): Record<string, AIInsight> | AIInsight | undefined {
    if (employeeId) {
      return (
        this.aiInsights[employeeId] || {
          employeeId,
          employeeName: this.getEmployeeById(employeeId)?.fullName || 'Employee',
          department: this.getEmployeeById(employeeId)?.department || 'General',
          productivityScore: 82,
          attendanceScore: 90,
          engagementScore: 85,
          burnoutRisk: 'Low',
          workloadLevel: 'Optimal',
          attendanceRisk: 'Low',
          predictedWeeklyOutput: 88,
          keyFactors: [
            { name: 'Consistent Workday Timing', impact: 'positive', score: 10, description: 'Stable arrival and check-out patterns.' },
            { name: 'Task Delivery Pace', impact: 'positive', score: 8, description: 'Steady sprint contributions.' }
          ],
          actionableRecommendation: 'Steady performance. Maintain clear work-life boundaries.',
          wellbeingSummary: 'Healthy balance across weekly pulse check-ins.',
          lastEvaluated: new Date().toISOString()
        }
      );
    }
    return this.aiInsights;
  }

  private refreshAIInsight(employeeId: string, wellbeingScore: number, stress: number, workload: number) {
    const emp = this.getEmployeeById(employeeId);
    const existing = this.aiInsights[employeeId];

    const burnoutRisk: AIInsight['burnoutRisk'] =
      stress >= 4 || workload >= 5 || wellbeingScore < 50
        ? 'High'
        : stress >= 3 || workload >= 4 || wellbeingScore < 70
          ? 'Moderate'
          : 'Low';

    const workloadLevel: AIInsight['workloadLevel'] =
      workload >= 5 ? 'Overloaded' : workload === 4 ? 'Heavy' : workload <= 2 ? 'Low' : 'Optimal';

    const currentProd = existing?.productivityScore || 85;
    const newProd = Math.max(50, Math.min(99, Math.round(currentProd * 0.7 + wellbeingScore * 0.3)));

    this.aiInsights[employeeId] = {
      employeeId,
      employeeName: emp?.fullName || 'Employee',
      department: emp?.department || 'Engineering',
      productivityScore: newProd,
      attendanceScore: existing?.attendanceScore || 92,
      engagementScore: Math.round(wellbeingScore * 0.9 + 10),
      burnoutRisk,
      workloadLevel,
      attendanceRisk: burnoutRisk === 'High' ? 'High' : burnoutRisk === 'Moderate' ? 'Medium' : 'Low',
      predictedWeeklyOutput: Math.max(60, Math.min(100, Math.round(newProd * 0.95))),
      keyFactors: [
        {
          name: 'Wellbeing Pulse Index',
          impact: wellbeingScore >= 70 ? 'positive' : 'negative',
          score: wellbeingScore >= 70 ? 12 : -12,
          description: `Latest pulse score ${wellbeingScore}/100 with stress rating ${stress}/5.`
        },
        {
          name: 'Workload Distribution',
          impact: workloadLevel === 'Overloaded' || workloadLevel === 'Heavy' ? 'negative' : 'positive',
          score: workloadLevel === 'Overloaded' ? -15 : workloadLevel === 'Heavy' ? -8 : 10,
          description: `Workload assessed as ${workloadLevel.toLowerCase()}.`
        },
        {
          name: 'Attendance Consistency',
          impact: 'positive',
          score: 10,
          description: 'Regular check-in cadence registered this month.'
        }
      ],
      actionableRecommendation:
        burnoutRisk === 'High'
          ? 'Urgent workload rebalancing suggested. Encourage taking a scheduled recovery day off.'
          : burnoutRisk === 'Moderate'
            ? 'Monitor project deadlines. Encourage 25-minute Pomodoro focus blocks with breaks.'
            : 'Sustained peak performance. Ready for advanced initiatives.',
      wellbeingSummary: `Recent pulse indicates ${wellbeingScore}/100 wellbeing health with ${burnoutRisk.toLowerCase()} burnout potential.`,
      lastEvaluated: new Date().toISOString()
    };
  }

  // Notifications
  public getNotifications(recipientId?: string): NotificationItem[] {
    if (!recipientId) return [...this.notifications];
    return this.notifications.filter(
      (n) => n.recipientId === 'all' || n.recipientId === recipientId || (recipientId === 'admin' && n.recipientId === 'admin')
    );
  }

  public addNotification(item: Omit<NotificationItem, 'id' | 'isRead' | 'timestamp'>) {
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      isRead: false,
      timestamp: new Date().toISOString(),
      ...item
    };
    this.notifications.unshift(notif);
    this.saveState();
  }

  public markNotificationRead(id: string) {
    const n = this.notifications.find((item) => item.id === id);
    if (n) {
      n.isRead = true;
      this.saveState();
    }
  }

  public markAllNotificationsRead(recipientId?: string) {
    this.notifications.forEach((n) => {
      if (!recipientId || n.recipientId === recipientId || n.recipientId === 'all') {
        n.isRead = true;
      }
    });
    this.saveState();
  }

  // Reset demo data
  public resetToDefault() {
    localStorage.clear();
    this.loadState();
    this.notify();
  }
}

export const store = new DataStore();
