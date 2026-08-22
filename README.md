# 🌟 DayFlow – Human Resource Management System

> **Every workday, perfectly aligned.**

DayFlow is a **Human Resource Management System (HRMS)** designed to digitize and simplify everyday HR operations. It provides employees and HR/Admin users with a centralized platform for managing employee profiles, attendance, leave requests, payroll visibility, and approval workflows.

---

## 📌 Table of Contents

* [Introduction](#-introduction)
* [Purpose](#-purpose)
* [Scope](#-scope)
* [User Roles](#-user-roles)
* [Features](#-features)
* [Functional Requirements](#-functional-requirements)
* [System Architecture](#-system-architecture)
* [Technology Stack](#-technology-stack)
* [Project Structure](#-project-structure)
* [Workflow](#-workflow)
* [Future Enhancements](#-future-enhancements)
* [Excalidraw](#-excalidraw)
* [Getting Started](#-getting-started)
* [Contributors](#-contributors)

---

## 🚀 Introduction

Human Resource departments handle large amounts of employee information, attendance records, leave requests, salary details, and approval processes.

**DayFlow** provides a centralized HRMS solution that reduces manual work and improves the efficiency of HR operations through digital workflows and role-based access.

---

## 🎯 Purpose

The purpose of DayFlow is to:

* Digitize core HR operations
* Simplify employee management
* Track employee attendance
* Manage leave and time-off requests
* Provide payroll and salary visibility
* Implement HR/Admin approval workflows
* Provide secure authentication and authorization
* Improve communication through notifications
* Generate useful HR analytics and reports

---

## 📋 Scope

DayFlow provides the following major functionalities:

* 🔐 Secure Sign Up / Sign In
* 👥 Role-based access control
* 👤 Employee profile management
* 🕐 Daily and weekly attendance tracking
* 🏖️ Leave and time-off management
* 💰 Payroll and salary visibility
* ✅ HR/Admin approval workflows
* 📧 Email and notification alerts
* 📊 Analytics and reports

---

## 👥 User Roles

### 👨‍💼 Admin / HR Officer

Admin/HR users have management and approval privileges.

They can:

* Manage employees
* View employee profiles
* View attendance records
* Approve/reject leave requests
* View and manage payroll information
* Update employee salary structures
* Monitor HR activities
* Generate reports and analytics

### 👨‍💻 Employee

Employees have limited access to their own information.

They can:

* View their profile
* Update limited personal information
* Check in/check out
* View attendance
* Apply for leave
* Track leave request status
* View salary information
* Receive notifications

---

# ✨ Features

## 🔐 Authentication & Authorization

* User registration
* Secure login
* Employee ID-based registration
* Email and password authentication
* Role selection
* Email verification
* Role-based access control
* Login validation and error messages

---

## 📊 Employee Dashboard

The employee dashboard provides quick access to:

* 👤 Profile
* 🕐 Attendance
* 🏖️ Leave Requests
* 💰 Salary Details
* 🔔 Notifications
* 🚪 Logout

It can also display recent activities and important alerts.

---

## 🛠️ Admin / HR Dashboard

The Admin/HR dashboard provides:

* Employee list
* Employee details
* Attendance records
* Leave requests
* Leave approval controls
* Payroll information
* Salary management
* HR analytics
* Reports

Admins can easily switch between employees and manage their information.

---

## 👤 Employee Profile Management

### View Profile

Employees can view:

* Personal details
* Job details
* Salary structure
* Documents
* Profile picture

### Edit Profile

Employees can update limited information such as:

* Address
* Phone number
* Profile picture

Admins can edit complete employee information.

---

## 🕐 Attendance Management

DayFlow provides daily and weekly attendance tracking.

### Attendance Status

* ✅ Present
* ❌ Absent
* 🌓 Half-day
* 🏖️ Leave

### Employee

Employees can:

* Check in
* Check out
* View their attendance
* View daily/weekly attendance

### Admin / HR

Admins can:

* View attendance of all employees
* Monitor attendance records
* Review employee attendance
* Generate attendance reports

---

## 🏖️ Leave & Time-Off Management

Employees can submit leave requests by selecting:

* Paid Leave
* Sick Leave
* Unpaid Leave

They can also:

* Select date range
* Add remarks
* Track request status

### Leave Status

```text
Pending → Approved
        ↘ Rejected
```

### Admin / HR

Admins can:

* View all leave requests
* Approve requests
* Reject requests
* Add comments
* Monitor employee leave history

Changes are reflected immediately in the employee records.

---

## 💰 Payroll & Salary Management

### Employee

Employees can view their salary information in **read-only mode**.

### Admin / HR

Admins can:

* View employee payroll
* Update salary structure
* Manage salary information
* Verify payroll accuracy
* Generate salary-related reports

---

## 🔔 Notifications

DayFlow can provide notifications for:

* Leave approval/rejection
* Attendance alerts
* Important HR announcements
* Payroll updates
* Email verification
* Other employee activities

---

## 📊 Analytics & Reports

The system provides HR analytics and reports such as:

* Attendance reports
* Employee statistics
* Leave reports
* Salary reports
* Payroll summaries
* Salary slips
* Workforce activity reports

---

# ⚙️ Functional Requirements

| Module         | Functionality            |
| -------------- | ------------------------ |
| Authentication | Sign Up / Sign In        |
| Authorization  | Role-based access        |
| Employee       | Profile management       |
| Attendance     | Check-in / Check-out     |
| Attendance     | Daily / Weekly view      |
| Leave          | Apply for leave          |
| Leave          | Approve / Reject         |
| Payroll        | Salary visibility        |
| Payroll        | Salary management        |
| Notification   | Email / system alerts    |
| Reports        | HR analytics and reports |

---

# 🏗️ System Architecture

```text
                   DAYFLOW
                      │
             HTML + CSS + JavaScript
                      │
                Fetch / Axios
                      │
                      ▼
              Python FastAPI
                      │
             ┌────────┴────────┐
             │                 │
             ▼                 ▼
        PostgreSQL          AI Engine
                               │
                         Pandas + Scikit-learn
                               │
                     Workforce Prediction
```

---

# 💻 Technology Stack

### Frontend

* HTML5
* CSS3
* JavaScript
* Fetch API / Axios

### Backend

* Python
* FastAPI

### Database

* PostgreSQL

### AI / Machine Learning

* Python
* Pandas
* Scikit-learn

### Development Tools

* Visual Studio Code
* Git
* GitHub
* Excalidraw

---

# 📁 Project Structure

```text
DayFlow/
│
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── dashboard.html
│   ├── profile.html
│   ├── attendance.html
│   ├── leave.html
│   ├── payroll.html
│   ├── css/
│   ├── js/
│   └── assets/
│
├── backend/
│   ├── main.py
│   ├── routes/
│   ├── models/
│   ├── schemas/
│   └── database/
│
├── ai/
│   ├── model.py
│   ├── prediction.py
│   └── dataset/
│
├── README.md
└── requirements.txt
```

> Update the folder structure above according to your actual project files.

---

# 🔄 Workflow

```text
User
 │
 ▼
Sign Up / Sign In
 │
 ▼
Authentication
 │
 ▼
Role Verification
 │
 ├───────────────┐
 ▼               ▼
Employee       Admin / HR
 │               │
 ▼               ▼
Dashboard      Dashboard
 │               │
 ├─ Profile      ├─ Employees
 ├─ Attendance   ├─ Attendance
 ├─ Leave        ├─ Leave Approval
 └─ Payroll      ├─ Payroll
                 └─ Reports
```

---

# 🔮 Future Enhancements

The following features can be added in future versions of DayFlow:

### 🤖 1. AI-Powered Workforce Prediction

Use machine learning to predict:

* Employee attrition
* Workforce requirements
* Attendance trends
* Employee performance trends

### 📱 2. Mobile Application

Develop Android/iOS applications so employees can access DayFlow from mobile devices.

### 🧠 3. AI HR Assistant

Add an AI chatbot that can answer questions such as:

* "How many leave days do I have?"
* "Show my attendance."
* "When is my next salary?"
* "What is the leave policy?"

### 📈 4. Advanced HR Analytics

Provide interactive dashboards for:

* Employee performance
* Attendance trends
* Leave patterns
* Attrition prediction
* Workforce planning

### 📄 5. Automated Document Generation

Automatically generate:

* Salary slips
* Experience letters
* Offer letters
* Employee reports
* Attendance reports

### 🔔 6. Real-Time Notifications

Implement real-time notifications for:

* Leave approvals
* Attendance reminders
* HR announcements
* Payroll updates

### 🗓️ 7. Calendar Integration

Integrate company calendars for:

* Holidays
* Employee leave
* Meetings
* Company events

### 🔒 8. Enhanced Security

Future security improvements may include:

* Two-factor authentication
* JWT-based authentication
* Password hashing
* Session management
* Audit logs

### 🌐 9. Cloud Deployment

Deploy the complete application using cloud services for:

* Frontend hosting
* Backend hosting
* Cloud database
* Scalable infrastructure

### 📊 10. Automated HR Reports

Allow HR officers to schedule and automatically receive reports through email.

---

# 🎨 Excalidraw

The system architecture and design can be viewed in Excalidraw:

[DayFlow Excalidraw Diagram](https://link.excalidraw.com/l/65VNwvy7c4X/58RLEJ4oOwh?utm_source=chatgpt.com)

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone <your-repository-url>
cd DayFlow
```

## 2. Frontend

Open the frontend folder and run it using your preferred local development server.

Example:

```bash
cd frontend
```

## 3. Backend

Install the required Python dependencies:

```bash
pip install -r requirements.txt
```

Run the FastAPI server:

```bash
uvicorn main:app --reload
```

The backend will normally be available at:

```text
http://localhost:8000
```

## 4. Database

Configure PostgreSQL and update the database connection settings in the backend configuration.

---

# 📌 Project Goals

DayFlow aims to make HR management:

* **Simple**
* **Secure**
* **Fast**
* **Transparent**
* **Data-driven**
* **Employee-friendly**

> **DayFlow — Every workday, perfectly aligned.**

---

# 👨‍💻 Contributors

Developed as a collaborative project by the **DayFlow Team**.

---

## 📜 License

This project is developed for educational, hackathon, and demonstration purposes.
