# 🚀 Dayflow

### Intelligent Human Resource Management System

> **Every workday, perfectly aligned.**

Dayflow is a modern **Human Resource Management System (HRMS)** designed to bring employee management, attendance, leave management, payroll visibility, approval workflows, notifications, and workforce analytics into one centralized platform.

Built with a focus on **simplicity, automation, security, and actionable insights**, Dayflow aims to reduce manual HR operations and create a smoother experience for both employees and HR teams.

---

## 🎯 The Problem

Traditional HR processes often rely on disconnected systems and manual workflows for:

* Employee information
* Attendance tracking
* Leave requests and approvals
* Payroll information
* HR communication
* Workforce reporting

This creates unnecessary administrative work and makes it difficult for employees and HR teams to access accurate information quickly.

---

## 💡 Our Solution

**Dayflow** provides a single platform where employees can manage their daily HR activities while HR/Admin teams can efficiently manage the workforce.

### One platform. Two experiences.

**Employee**

→ Manage profile
→ Track attendance
→ Check-in / Check-out
→ Apply for leave
→ View leave status
→ View payroll information
→ Receive notifications

**HR / Admin**

→ Manage employees
→ Monitor attendance
→ Review leave requests
→ Approve / Reject leave
→ Manage salary information
→ View workforce analytics
→ Generate reports

---

## ✨ Core Features

### 🔐 Secure Authentication & Role-Based Access

* Employee and HR/Admin authentication
* Role-based dashboards
* Protected access to sensitive HR information

### 👤 Employee Management

* Centralized employee profiles
* Personal and job information
* Profile updates
* Employee document and profile management

### ⏱️ Smart Attendance

* Check-in / Check-out
* Daily attendance tracking
* Weekly attendance overview
* Attendance status management
* HR-wide attendance monitoring

### 🌴 Leave Management

* Paid, Sick, and Unpaid leave
* Date-range based leave requests
* Leave status tracking
* HR approval / rejection workflow
* Admin comments and notifications

### 💰 Payroll Visibility

* Employee salary information
* Salary structure management
* Admin payroll control
* Read-only payroll access for employees

### 📊 Workforce Analytics

* Attendance overview
* Leave statistics
* Workforce trends
* HR dashboards and reports

### 🔔 Notifications

* Leave request notifications
* Approval / rejection alerts
* Important HR updates

---

## 🤖 Intelligent HR Assistant — Planned

As an advanced feature, Dayflow will include an **AI-powered HR Assistant** that can help employees access HR information using natural language.

Example:

> **Employee:** "How many leave days do I have?"

> **Dayflow AI:** "You have 8 paid leave days remaining."

Other planned capabilities:

* Attendance summaries
* Leave balance queries
* HR policy assistance
* Personalized employee insights
* Natural-language HR queries

**AI capabilities will be integrated with authorized HR data rather than functioning as a standalone chatbot.**

---

## 🏗️ System Architecture

```text
                         DAYFLOW
                            │
             ┌──────────────┴──────────────┐
             │                             │
        EMPLOYEE                       HR / ADMIN
             │                             │
             └──────────────┬──────────────┘
                            │
                     React Frontend
                            │
                         REST API
                            │
                    FastAPI Backend
                            │
                       PostgreSQL
                            │
              ┌─────────────┴─────────────┐
              │                           │
        HR Analytics                AI Assistant
```

---

## 🛠️ Technology Stack

| Layer             | Technology      |
| ----------------- | --------------- |
| Frontend          | React.js, Vite  |
| UI                | Tailwind CSS    |
| Routing           | React Router    |
| API Communication | Axios           |
| Charts            | Recharts        |
| Backend           | Python, FastAPI |
| ORM               | SQLAlchemy      |
| Authentication    | JWT             |
| Database          | PostgreSQL      |
| Deployment        | Vercel, Render  |
| AI                | Planned         |

---

## 📂 Project Structure

```text
dayflow/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── backend/
│   ├── models/
│   ├── schemas/
│   ├── routes/
│   ├── services/
│   ├── database.py
│   └── main.py
│
└── README.md
```

---

## 🔄 Key Workflow

```text
Employee Login
      │
      ▼
Employee Dashboard
      │
      ├── Check-in / Check-out
      │
      ├── Apply Leave
      │
      └── View Payroll
              │
              ▼
        HR / Admin Review
              │
        ┌─────┴─────┐
        ▼           ▼
     Approve      Reject
        │           │
        └─────┬─────┘
              ▼
       Employee Notification
              │
              ▼
       Analytics & Reports
```

---

## 🔒 Security & Access Control

Dayflow follows a role-based access approach:

| Feature             | Employee | HR / Admin |
| ------------------- | :------: | :--------: |
| Own Profile         |     ✅    |      ✅     |
| Own Attendance      |     ✅    |      ✅     |
| All Employees       |     ❌    |      ✅     |
| Apply Leave         |     ✅    |      ✅     |
| Approve Leave       |     ❌    |      ✅     |
| Own Payroll         |     ✅    |      ✅     |
| Manage Payroll      |     ❌    |      ✅     |
| Workforce Analytics |     ❌    |      ✅     |

Sensitive employee information is restricted according to user roles.

---

## 🗺️ Development Roadmap

### Phase 1 — Foundation

* [x] Project planning
* [x] Requirements analysis
* [ ] Frontend setup
* [ ] Backend setup
* [ ] Database setup

### Phase 2 — Core HRMS

* [ ] Authentication
* [ ] Role-based access
* [ ] Employee management
* [ ] Employee profile
* [ ] Attendance management
* [ ] Leave management
* [ ] Payroll management

### Phase 3 — Intelligence

* [ ] Notifications
* [ ] Workforce analytics
* [ ] HR reports
* [ ] AI HR Assistant

### Phase 4 — Production

* [ ] Testing
* [ ] Security validation
* [ ] UI/UX refinement
* [ ] Deployment
* [ ] Performance optimization

---

## 🏆 Hackathon Vision

Dayflow is designed to evolve beyond a traditional HR management system into an **intelligent workforce platform**.

Our vision is to:

**Reduce manual HR work → Automate repetitive workflows → Provide real-time insights → Improve employee experience**

---

## 📌 Project Status

🚧 **Currently in active development**

This project is being developed as a **hackathon solution** with a focus on building a functional, scalable, and user-friendly HR platform.

---

## 👥 Team

**Dayflow Team**

> Building smarter workplaces, one workflow at a time.

---

## 📄 Reference

The functional requirements and scope of Dayflow are based on the provided **Dayflow – Human Resource Management System** specification.
