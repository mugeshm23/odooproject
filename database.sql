-- 1. DEPARTMENTS TABLE
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(20) UNIQUE,
    manager_id INT, -- Foreign key added via ALTER below
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
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'employee' CHECK (role IN ('employee', 'hr_admin', 'manager', 'finance_admin')),
    department_id INT REFERENCES departments(id) ON DELETE SET NULL,
    reporting_manager_id INT REFERENCES users(id) ON DELETE SET NULL,
    job_title VARCHAR(100),
    date_of_birth DATE,
    joining_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'resigned', 'terminated', 'notice_period')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE departments 
ADD CONSTRAINT fk_dept_manager FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL;

-- 3. SHIFT MANAGEMENT (NEW FEATURE)
CREATE TABLE shifts (
    id SERIAL PRIMARY KEY,
    shift_name VARCHAR(50) NOT NULL, -- Morning, Evening, Night
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employee_shifts (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    shift_id INT NOT NULL REFERENCES shifts(id) ON DELETE CASCADE,
    assigned_from DATE NOT NULL,
    assigned_to DATE,
    CONSTRAINT unique_user_active_shift UNIQUE(user_id, assigned_from)
);

-- 4. ENHANCED ATTENDANCE TABLE
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    check_in TIMESTAMP,
    check_out TIMESTAMP,
    total_hours DECIMAL(4,2),
    overtime_hours DECIMAL(4,2) DEFAULT 0.00,
    work_location VARCHAR(50) DEFAULT 'Office' CHECK (work_location IN ('Office', 'Remote', 'Hybrid')),
    status VARCHAR(20) DEFAULT 'Present' CHECK (status IN ('Present', 'Absent', 'Half-Day', 'On-Leave', 'Late')),
    CONSTRAINT unique_user_daily_attendance UNIQUE(user_id, date)
);

-- 5. LEAVE BALANCES TABLE
CREATE TABLE leave_balances (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    year INT NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
    paid_leave_balance INT DEFAULT 12,
    sick_leave_balance INT DEFAULT 6,
    casual_leave_balance INT DEFAULT 6,
    CONSTRAINT unique_user_yearly_balance UNIQUE(user_id, year)
);

-- 6. LEAVE REQUESTS TABLE
CREATE TABLE leave_requests (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    leave_type VARCHAR(30) NOT NULL CHECK (leave_type IN ('Paid', 'Sick', 'Casual', 'Unpaid', 'Maternity', 'Paternity')),
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    total_days INT NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Cancelled')),
    approved_by INT REFERENCES users(id) ON DELETE SET NULL,
    admin_comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. EXPENSE CLAIMS / REIMBURSEMENTS (NEW FEATURE)
CREATE TABLE expense_claims (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL, -- Travel, Food, Internet, Equipment
    amount DECIMAL(10,2) NOT NULL,
    expense_date DATE NOT NULL,
    receipt_url TEXT,
    description TEXT,
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Paid')),
    approved_by INT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. PAYROLL TABLE
CREATE TABLE payroll (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pay_period VARCHAR(20) NOT NULL,
    basic_salary DECIMAL(10,2) NOT NULL,
    hra DECIMAL(10,2) DEFAULT 0.00,
    allowances DECIMAL(10,2) DEFAULT 0.00,
    reimbursements DECIMAL(10,2) DEFAULT 0.00, -- Linked with expense claims
    bonus DECIMAL(10,2) DEFAULT 0.00,
    pf_deduction DECIMAL(10,2) DEFAULT 0.00,
    tax_deduction DECIMAL(10,2) DEFAULT 0.00,
    net_salary DECIMAL(10,2) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Processed', 'Failed')),
    payout_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. OFFBOARDING & RESIGNATIONS (NEW FEATURE)
CREATE TABLE resignations (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    resignation_date DATE NOT NULL,
    requested_relieving_date DATE NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Completed')),
    exit_interview_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. EMPLOYEE DOCUMENTS TABLE
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    document_name VARCHAR(150) NOT NULL,
    document_type VARCHAR(50) NOT NULL, -- ID Proof, Degree, Offer Letter, Experience Letter
    file_url TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. IN-SYSTEM NOTIFICATIONS (NEW FEATURE)
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. SYSTEM AUDIT LOGS
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    performed_by INT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    entity_affected VARCHAR(50),
    ip_address VARCHAR(45),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_attendance_user_date ON attendance(user_id, date);
CREATE INDEX IF NOT EXISTS idx_leave_requests_user ON leave_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_expense_claims_user ON expense_claims(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read);
