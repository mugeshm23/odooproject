import { jsPDF } from 'jspdf';
import { PayrollRecord, Employee, AttendanceRecord, LeaveRequest } from '../types';

export function generateSalarySlipPDF(record: PayrollRecord, employee?: Employee) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Colors
  const primaryColor = [30, 41, 59]; // Slate 800
  const accentColor = [14, 165, 233]; // Sky 500
  const lightBg = [248, 250, 252]; // Slate 50

  // Header Banner
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 38, 'F');

  // Company Brand
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('DAYFLOW', 14, 18);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text('Every workday, perfectly aligned. | HR & Workforce Operations', 14, 25);
  doc.text('100 Innovation Way, Suite 400, San Francisco, CA 94105', 14, 31);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('PAYSLIP', 196, 18, { align: 'right' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(186, 230, 253);
  doc.text(record.month, 196, 25, { align: 'right' });
  doc.text(`Ref: ${record.slipNumber}`, 196, 31, { align: 'right' });

  // Employee Information Box
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(14, 46, 182, 38, 3, 3, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 46, 182, 38, 3, 3, 'D');

  doc.setTextColor(51, 65, 85);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('EMPLOYEE DETAILS', 20, 54);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);

  // Left Column
  doc.text('Employee Name:', 20, 62);
  doc.text('Employee ID:', 20, 69);
  doc.text('Department:', 20, 76);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(record.employeeName, 55, 62);
  doc.text(record.employeeId, 55, 69);
  doc.text(record.department, 55, 76);

  // Right Column
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Designation:', 110, 62);
  doc.text('Pay Period:', 110, 69);
  doc.text('Payment Mode:', 110, 76);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(record.designation, 142, 62);
  doc.text(record.payPeriod, 142, 69);
  doc.text(record.bankAccount, 142, 76);

  // Table Headers (Earnings vs Deductions)
  const startY = 92;
  doc.setFillColor(241, 245, 249);
  doc.rect(14, startY, 90, 8, 'F');
  doc.rect(106, startY, 90, 8, 'F');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('EARNINGS', 18, startY + 5.5);
  doc.text('AMOUNT (USD)', 100, startY + 5.5, { align: 'right' });

  doc.text('DEDUCTIONS', 110, startY + 5.5);
  doc.text('AMOUNT (USD)', 192, startY + 5.5, { align: 'right' });

  // Earnings Rows
  let curY = startY + 14;
  const earnings = [
    { label: 'Basic Salary', amount: record.basicSalary },
    { label: 'House Rent Allowance (HRA)', amount: Math.round(record.allowance * 0.6) },
    { label: 'Special / Medical Allowance', amount: Math.round(record.allowance * 0.4) },
    { label: 'Performance Bonus', amount: record.bonus },
    { label: 'Overtime Compensation', amount: record.overtimePay }
  ];

  const deductions = [
    { label: 'Federal & State Income Tax', amount: record.tax },
    { label: 'Provident Fund / 401(k)', amount: Math.round(record.deductions * 0.7) },
    { label: 'Health Insurance Premium', amount: Math.round(record.deductions * 0.3) }
  ];

  const maxRows = Math.max(earnings.length, deductions.length);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);

  for (let i = 0; i < maxRows; i++) {
    const earn = earnings[i];
    const ded = deductions[i];

    if (earn) {
      doc.setTextColor(71, 85, 105);
      doc.text(earn.label, 18, curY);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`$${earn.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 100, curY, { align: 'right' });
      doc.setFont('helvetica', 'normal');
    }

    if (ded) {
      doc.setTextColor(71, 85, 105);
      doc.text(ded.label, 110, curY);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`$${ded.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 192, curY, { align: 'right' });
      doc.setFont('helvetica', 'normal');
    }

    // Divider line
    doc.setDrawColor(241, 245, 249);
    doc.line(14, curY + 2, 104, curY + 2);
    doc.line(106, curY + 2, 196, curY + 2);

    curY += 8;
  }

  // Subtotals
  const totalEarnings = record.basicSalary + record.allowance + record.bonus + record.overtimePay;
  const totalDeductions = record.deductions + record.tax;

  doc.setFillColor(248, 250, 252);
  doc.rect(14, curY, 90, 8, 'F');
  doc.rect(106, curY, 90, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('Total Earnings', 18, curY + 5.5);
  doc.text(`$${totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 100, curY + 5.5, { align: 'right' });

  doc.text('Total Deductions', 110, curY + 5.5);
  doc.text(`$${totalDeductions.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 192, curY + 5.5, { align: 'right' });

  // NET SALARY BANNER
  curY += 16;
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.roundedRect(14, curY, 182, 22, 3, 3, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('NET SALARY TRANSFERRED', 22, curY + 9);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text(`Disbursed on ${record.payDate} | Status: ${record.status.toUpperCase()}`, 22, curY + 16);

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(56, 189, 248); // Bright sky
  doc.text(`$${record.netSalary.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 190, curY + 14, { align: 'right' });

  // Footer & Signatures
  curY += 36;
  doc.setDrawColor(203, 213, 225);
  doc.line(20, curY, 80, curY);
  doc.line(130, curY, 190, curY);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Employee Signature', 50, curY + 5, { align: 'center' });
  doc.text('Authorized HR / Finance Signatory', 160, curY + 5, { align: 'center' });
  doc.text('DayFlow Systems Inc. - Certified Digital Record', 160, curY + 9, { align: 'center' });

  // Disclaimer
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'This is a system-generated salary slip and does not require a physical seal when verified via DayFlow HR Portal.',
    105,
    280,
    { align: 'center' }
  );

  doc.save(`Salary_Slip_${record.month.replace(' ', '_')}_${record.employeeId}.pdf`);
}

export function exportToCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const csvContent = [headers.join(','), ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
