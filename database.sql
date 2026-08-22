-- 1. DEPARTMENTS TABLE
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(20) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. USERS (EMPLOYEES) TABLE
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    employee_code VARCHAR(30) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL, -- Kept exact column name as expected by backend
    role VARCHAR(20) DEFAULT 'employee' CHECK (role IN ('employee', 'hr_admin', 'manager')),
    department_id INT REFERENCES departments(id) ON DELETE SET NULL,
    reporting_manager_id INT REFERENCES users(id) ON DELETE SET NULL,
    job_title VARCHAR(100),
    date_of_birth DATE,
    joining_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'resigned', 'terminated')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Circular reference fix for department manager
ALTER TABLE departments 
ADD COLUMN manager_id INT REFERENCES users(id) ON DELETE SET NULL;

-- 3. ATTENDANCE TABLE
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    check_in TIMESTAMP,
    check_out TIMESTAMP,
    total_hours DECIMAL(4,2),
    overtime_hours DECIMAL(4,2) DEFAULT 0.00,
    work_location VARCHAR(50) DEFAULT 'Office' CHECK (work_location IN ('Office', 'Remote', 'Hybrid')),
    status VARCHAR(20) DEFAULT 'Present' CHECK (status IN ('Present', 'Absent', 'Half-Day', 'On-Leave')),
    CONSTRAINT unique_user_daily_attendance UNIQUE(user_id, date)
);

-- 4. LEAVE BALANCES TABLE
CREATE TABLE leave_balances (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    year INT NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
    paid_leave_balance INT DEFAULT 12,
    sick_leave_balance INT DEFAULT 6,
    casual_leave_balance INT DEFAULT 6,
    CONSTRAINT unique_user_yearly_balance UNIQUE(user_id, year)
);

-- 5. LEAVE REQUESTS TABLE
CREATE TABLE leave_requests (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    leave_type VARCHAR(30) NOT NULL CHECK (leave_type IN ('Paid', 'Sick', 'Casual', 'Unpaid')),
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    total_days INT NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Cancelled')),
    approved_by INT REFERENCES users(id) ON DELETE SET NULL,
    admin_comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. PAYROLL TABLE
CREATE TABLE payroll (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pay_period VARCHAR(20) NOT NULL, -- e.g., '2026-03'
    basic_salary DECIMAL(10,2) NOT NULL,
    hra DECIMAL(10,2) DEFAULT 0.00,
    allowances DECIMAL(10,2) DEFAULT 0.00,
    bonus DECIMAL(10,2) DEFAULT 0.00,
    pf_deduction DECIMAL(10,2) DEFAULT 0.00,
    tax_deduction DECIMAL(10,2) DEFAULT 0.00,
    net_salary DECIMAL(10,2) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Processed', 'Failed')),
    payout_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. EMPLOYEE DOCUMENTS TABLE
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    document_name VARCHAR(150) NOT NULL,
    document_type VARCHAR(50) NOT NULL, -- e.g., 'Aadhar', 'Passport', 'Degree'
    file_url TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. SYSTEM AUDIT LOGS
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    performed_by INT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    entity_affected VARCHAR(50),
    ip_address VARCHAR(45),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. PERFORMANCE INDEXES (Backend-a affect pannamal DB Queries-a Fast aakkum)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_attendance_user_date ON attendance(user_id, date);
CREATE INDEX IF NOT EXISTS idx_leave_requests_user ON leave_requests(user_id);
