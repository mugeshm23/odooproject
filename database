CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'employee'
);

CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    date DATE NOT NULL,
    check_in TIME,
    check_out TIME,
    status VARCHAR(20)
);

CREATE TABLE leave_requests (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    leave_type VARCHAR(30),
    from_date DATE,
    to_date DATE,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'Pending'
);

CREATE TABLE payroll (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    basic_salary DECIMAL(10,2),
    allowance DECIMAL(10,2),
    deduction DECIMAL(10,2),
    net_salary DECIMAL(10,2)
);
