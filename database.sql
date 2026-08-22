-- 1. EXTENSIONS (Performance and UUID Support)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. DEPARTMENTS TABLE
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(20) UNIQUE,
    manager_id INT, -- Foreign key added below via ALTER to prevent circular dependency
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. USERS (EMPLOYEES) TABLE
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    employee_code VARCHAR(30) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL, -- Renamed from 'password' for clarity
    role VARCHAR(20) DEFAULT 'employee' CHECK (role IN ('employee', 'hr_admin', 'manager')),
    department_id INT REFERENCES departments(id) ON DELETE SET NULL,
    reporting_manager_id INT REFERENCES users(id) ON DELETE SET NULL,
    job_title VARCHAR(100),
    date_of_birth DATE,
    joining_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'resigned', 'terminated')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Circular reference constraint for Department Manager
ALTER TABLE departments 
ADD CONSTRAINT fk_departments_manager 
FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL;

-- 4. ATTENDANCE TABLE
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    check_in TIMESTAMP WITH TIME ZONE,
    check_out TIMESTAMP WITH TIME ZONE,
    total_hours NUMERIC(4,2),
    overtime_hours NUMERIC(4,2) DEFAULT 0.00,
    work_location VARCHAR(50) DEFAULT 'Office' CHECK (work_location IN ('Office', 'Remote', 'Hybrid')),
    status VARCHAR(20) DEFAULT 'Present' CHECK (status IN ('Present', 'Absent', 'Half-Day', 'On-Leave')),
    CONSTRAINT unique_user_daily_attendance UNIQUE(user_id, date)
);

-- 5. LEAVE BALANCES TABLE
CREATE TABLE leave_balances (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    year INT NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
    paid_leave_balance INT DEFAULT 12 CHECK (paid_leave_balance >= 0),
    sick_leave_balance INT DEFAULT 6 CHECK (sick_leave_balance >= 0),
    casual_leave_balance INT DEFAULT 6 CHECK (casual_leave_balance >= 0),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_yearly_balance UNIQUE(user_id, year)
);

-- 6. LEAVE REQUESTS TABLE
CREATE TABLE leave_requests (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    leave_type VARCHAR(30) NOT NULL CHECK (leave_type IN ('Paid', 'Sick', 'Casual', 'Unpaid')),
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    total_days INT NOT NULL CHECK (total_days > 0),
    reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Cancelled')),
    approved_by INT REFERENCES users(id) ON DELETE SET NULL,
    admin_comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_dates CHECK (to_date >= from_date)
);

-- 7. PAYROLL TABLE
CREATE TABLE payroll (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pay_period VARCHAR(7) NOT NULL, -- Format: 'YYYY-MM'
    basic_salary NUMERIC(10,2) NOT NULL CHECK (basic_salary >= 0),
    hra NUMERIC(10,2) DEFAULT 0.00 CHECK (hra >= 0),
    allowances NUMERIC(10,2) DEFAULT 0.00 CHECK (allowances >= 0),
    bonus NUMERIC(10,2) DEFAULT 0.00 CHECK (bonus >= 0),
    pf_deduction NUMERIC(10,2) DEFAULT 0.00 CHECK (pf_deduction >= 0),
    tax_deduction NUMERIC(10,2) DEFAULT 0.00 CHECK (tax_deduction >= 0),
    net_salary NUMERIC(10,2) NOT NULL CHECK (net_salary >= 0),
    payment_status VARCHAR(20) DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Processed', 'Failed')),
    payout_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_pay_period UNIQUE(user_id, pay_period)
);

-- 8. EMPLOYEE DOCUMENTS TABLE
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    document_name VARCHAR(150) NOT NULL,
    document_type VARCHAR(50) NOT NULL, -- e.g., 'ID Proof', 'Passport', 'Degree'
    file_url TEXT NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. SYSTEM AUDIT LOGS
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    performed_by INT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    entity_affected VARCHAR(50),
    ip_address VARCHAR(45),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
-- OPTIMIZATIONS: INDEXES (Query Performance Direct Upgrades)
-- ========================================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_department ON users(department_id);
CREATE INDEX idx_users_manager ON users(reporting_manager_id);
CREATE INDEX idx_attendance_user_date ON attendance(user_id, date);
CREATE INDEX idx_leave_requests_user ON leave_requests(user_id, status);
CREATE INDEX idx_payroll_user_period ON payroll(user_id, pay_period);

-- ========================================================
-- AUTOMATION: AUTOMATIC UPDATED_AT TIMESTAMP TRIGGER
-- ========================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_leave_requests_modtime BEFORE UPDATE ON leave_requests FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_payroll_modtime BEFORE UPDATE ON payroll FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
