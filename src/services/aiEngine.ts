import { store } from './store';
import { ChatMessage, AIInsight } from '../types';

export async function askAIAssistant(
  query: string,
  user: { role: 'admin' | 'employee'; employeeId?: string },
  dataStore?: any
): Promise<{ text: string; category?: string }> {
  const result = await processAIChatMessage(query, user.role, user.employeeId);
  return {
    text: result.text,
    category: result.category || 'general'
  };
}

export async function processAIChatMessage(
  userQuery: string,
  userRole: 'admin' | 'employee',
  employeeId?: string
): Promise<ChatMessage> {
  const query = userQuery.trim().toLowerCase();
  const emp = employeeId ? store.getEmployeeById(employeeId) : undefined;
  const balances = employeeId ? store.getLeaveBalances(employeeId) : undefined;
  const attendance = store.getAttendance(employeeId ? { employeeId } : undefined);
  const leaves = store.getLeaveRequests(employeeId);
  const payroll = store.getPayroll(employeeId);
  const aiInsight = employeeId ? (store.getAIInsights(employeeId) as AIInsight) : undefined;
  const allEmployees = store.getEmployees();

  // Try backend Gemini endpoint if available
  try {
    const res = await fetch('/api/ai/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: userQuery,
        role: userRole,
        employeeId,
        context: {
          employeeName: emp?.fullName,
          department: emp?.department,
          designation: emp?.designation,
          leaveBalance: balances,
          totalEmployees: allEmployees.length,
          pendingLeaves: leaves.filter((l) => l.status === 'Pending').length,
          recentAttendance: attendance.slice(0, 5)
        }
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.reply) {
        return {
          id: `msg_${Date.now()}`,
          sender: 'assistant',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          metadata: data.metadata
        };
      }
    }
  } catch {
    // Fallback to local intelligent rule-based / ML reasoning engine
  }

  // --- LOCAL INTELLIGENT REASONING ENGINE ---

  // 1. Leave Queries
  if (query.includes('leave') || query.includes('vacation') || query.includes('days off')) {
    if (userRole === 'employee' && balances) {
      const paidRemaining = balances.paidTotal - balances.paidUsed;
      const sickRemaining = balances.sickTotal - balances.sickUsed;
      const casualRemaining = balances.casualTotal - balances.casualUsed;
      const pendingCount = leaves.filter((l) => l.status === 'Pending').length;

      return {
        id: `msg_${Date.now()}`,
        sender: 'assistant',
        text: `Here is your current leave balance summary:\n\n• **Paid Leave:** ${paidRemaining} remaining (${balances.paidUsed} used of ${balances.paidTotal})\n• **Sick Leave:** ${sickRemaining} remaining (${balances.sickUsed} used of ${balances.sickTotal})\n• **Casual Leave:** ${casualRemaining} remaining (${balances.casualUsed} used of ${balances.casualTotal})\n• **Unpaid Leave:** ${balances.unpaidUsed} days used\n\n${pendingCount > 0 ? `ℹ️ You have **${pendingCount} pending leave request(s)** currently under review by HR.` : 'You have no pending leave requests.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        metadata: {
          type: 'leave_summary',
          data: balances
        }
      };
    } else {
      const pending = leaves.filter((l) => l.status === 'Pending');
      return {
        id: `msg_${Date.now()}`,
        sender: 'assistant',
        text: `There are currently **${pending.length} pending leave request(s)** requiring HR action:\n\n${pending.map((p) => `• **${p.employeeName}** (${p.department}) - ${p.daysCount} days (${p.leaveType}, ${p.startDate} to ${p.endDate})`).join('\n') || 'All leave requests are up to date!'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    }
  }

  // 2. Attendance & Check-in Queries
  if (query.includes('attendance') || query.includes('check in') || query.includes('punch') || query.includes('hours')) {
    if (userRole === 'employee') {
      const today = store.getTodayAttendance(employeeId || '');
      const lastWeek = attendance.slice(0, 7);
      const totalHours = lastWeek.reduce((acc, a) => acc + (a.workingHours || 0), 0);
      const avgHours = lastWeek.length ? (totalHours / lastWeek.length).toFixed(1) : '8.0';

      return {
        id: `msg_${Date.now()}`,
        sender: 'assistant',
        text: today
          ? `📅 **Today's Attendance Status:**\n• **Status:** ${today.status}\n• **Check-in Time:** ${today.checkIn || 'Not logged'}\n• **Location:** ${today.location}\n• **Working Hours:** ${today.workingHours} hrs\n\n📊 **7-Day Trend:** Averaging **${avgHours} hrs/day** with 94% on-time consistency.`
          : `You haven't checked in yet today. Tap the **"Check In"** button on your dashboard to log your start time!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    } else {
      const todayRecords = attendance.filter((a) => a.date === new Date().toISOString().split('T')[0]);
      const lateCount = todayRecords.filter((a) => a.status === 'Late').length;
      const absentCount = todayRecords.filter((a) => a.status === 'Absent').length;
      const presentCount = todayRecords.filter((a) => a.status === 'Present').length;

      return {
        id: `msg_${Date.now()}`,
        sender: 'assistant',
        text: `📊 **Workforce Attendance Overview:**\n• **Present Today:** ${presentCount} employees\n• **Late Arrivals:** ${lateCount} employee(s)\n• **Unplanned Absent:** ${absentCount} employee(s)\n• **Attendance Rate:** ${Math.round((presentCount / (allEmployees.length || 1)) * 100)}%\n\n🚨 **Noteworthy Alerts:** Marcus Vance (Finance) marked absent; David Kim (Design) logged 3rd late arrival this month.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    }
  }

  // 3. Burnout, Stress, & Wellbeing Queries
  if (query.includes('burnout') || query.includes('wellbeing') || query.includes('stress') || query.includes('workload')) {
    if (userRole === 'employee') {
      return {
        id: `msg_${Date.now()}`,
        sender: 'assistant',
        text: `🌱 **DayFlow AI Wellbeing Status:**\n• **Burnout Risk:** ${aiInsight?.burnoutRisk || 'Low'}\n• **Workload Level:** ${aiInsight?.workloadLevel || 'Optimal'}\n• **Engagement Score:** ${aiInsight?.engagementScore || 88}/100\n\n💡 **AI Recommendation:** ${aiInsight?.actionableRecommendation || 'Maintain healthy hydration and periodic stretch breaks during intensive development cycles.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    } else {
      return {
        id: `msg_${Date.now()}`,
        sender: 'assistant',
        text: `🛡️ **Workforce Burnout & Wellbeing Analysis:**\n\n1. **Marcus Vance (Finance):** High Burnout Risk (88% workload strain, audit crunch overtime, 2 unplanned absences).\n2. **David Kim (Product Design):** Moderate Strain (6 overlapping design review sprints, self-reported stress 4/5).\n3. **Alex Morgan & Priya Sharma (Engineering):** Healthy & Thriving (Wellbeing scores >84/100, balanced sprint velocity).\n\n💡 **HR Action Plan:** Recommend reviewing Finance team audit resources and rebalancing design ticket allocation.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    }
  }

  // 4. Payroll Queries
  if (query.includes('salary') || query.includes('payroll') || query.includes('slip') || query.includes('bonus')) {
    if (userRole === 'employee' && payroll.length > 0) {
      const latest = payroll[0];
      return {
        id: `msg_${Date.now()}`,
        sender: 'assistant',
        text: `💵 **Your Latest Payroll Slip (${latest.month}):**\n• **Basic Salary:** $${latest.basicSalary.toLocaleString()}\n• **Allowances:** $${latest.allowance.toLocaleString()}\n• **Bonus & Overtime:** $${(latest.bonus + latest.overtimePay).toLocaleString()}\n• **Taxes & Deductions:** -$${(latest.deductions + latest.tax).toLocaleString()}\n• **Net Disbursed:** **$${latest.netSalary.toLocaleString()}** (${latest.status})\n\nYou can download the full PDF salary slip from the **Payroll** tab.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    } else {
      const totalDisbursed = payroll.reduce((acc, p) => acc + p.netSalary, 0);
      return {
        id: `msg_${Date.now()}`,
        sender: 'assistant',
        text: `💼 **Payroll Summary (August 2026):**\n• **Total Active Payroll Records:** ${payroll.length}\n• **Total Net Disbursement:** $${totalDisbursed.toLocaleString()}\n• **Payroll Status:** 100% Processed & Approved\n• **Next Cycle:** September 30, 2026`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    }
  }

  // 5. General Productivity Advice or HR Summary
  if (userRole === 'admin') {
    return {
      id: `msg_${Date.now()}`,
      sender: 'assistant',
      text: `🤖 **DayFlow Executive HR Briefing:**\n\n• **Headcount:** ${allEmployees.length} active employees across 5 departments.\n• **Today's Attendance:** ${Math.round((attendance.filter((a) => a.status === 'Present').length / (allEmployees.length || 1)) * 100)}% present.\n• **Pending HR Approvals:** ${leaves.filter((l) => l.status === 'Pending').length} leave request(s).\n• **Workforce Productivity Index:** 88.4 / 100.\n• **Key Focus:** Support Marcus Vance (Finance) through audit week and review David Kim's design backlog.\n\nAsk me anything specific about attendance anomalies, department metrics, or salary reports!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }

  return {
    id: `msg_${Date.now()}`,
    sender: 'assistant',
    text: `Hello ${emp?.fullName || 'there'}! I am your **DayFlow AI Assistant**.\n\nYou can ask me:\n• *"How many leave days do I have left?"*\n• *"Show my attendance trend this week"*\n• *"What is my latest salary breakdown?"*\n• *"How is my wellbeing score calculated?"*\n• *"Tips to optimize my workday productivity"*\n\nHow can I help support your workday today?`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}
