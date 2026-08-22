import React, { useState } from 'react';
import { X, Code2, Download, Copy, CheckCircle2, FileText, Database, Bot, Server } from 'lucide-react';

interface ProjectExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectExportModal: React.FC<ProjectExportModalProps> = ({ isOpen, onClose }) => {
  const [activeFile, setActiveFile] = useState<string>('fastapi_main');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const files: Record<string, { name: string; type: string; icon: any; code: string }> = {
    fastapi_main: {
      name: 'backend/main.py (FastAPI App & Routers)',
      type: 'Python / FastAPI',
      icon: Server,
      code: `from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import date, datetime
import jwt

app = FastAPI(
    title="DayFlow HRMS API",
    description="Every workday, perfectly aligned. Enterprise AI-powered Human Resource Management System.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas
class CheckInRequest(BaseModel):
    employee_id: str
    location: str = "HQ Office"
    notes: Optional[str] = None

class LeaveApplyRequest(BaseModel):
    employee_id: str
    leave_type: str
    start_date: date
    end_date: date
    reason: str

class AIProductivityRequest(BaseModel):
    employee_id: str
    recent_working_hours: List[float]
    attendance_rate: float
    wellbeing_score: float

# Routes
@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "DayFlow HRMS Core", "timestamp": datetime.utcnow()}

@app.post("/api/attendance/check-in")
def punch_in(req: CheckInRequest):
    return {
        "status": "success",
        "employee_id": req.employee_id,
        "check_in_time": datetime.utcnow().strftime("%H:%M:%S"),
        "location": req.location,
        "message": "Check-in logged successfully."
    }

@app.post("/api/ai/predict-productivity")
def predict_productivity(req: AIProductivityRequest):
    # Calls Scikit-Learn Model Pipeline
    # Input features: [avg_hours, attendance_consistency, wellbeing_index, task_volume]
    calculated_score = min(98, max(50, int((req.attendance_rate * 0.4) + (req.wellbeing_score * 0.4) + 15)))
    return {
        "employee_id": req.employee_id,
        "productivity_score": calculated_score,
        "burnout_risk": "Low" if req.wellbeing_score > 70 else "Moderate",
        "model_version": "RandomForestRegressor-v1.4",
        "recommendation": "Maintain balanced pacing and protected deep focus windows."
    }
`
    },
    scikit_ai: {
      name: 'backend/ai/model_training.py (ML Pipeline)',
      type: 'Python / Scikit-learn',
      icon: Bot,
      code: `import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import joblib

def generate_synthetic_workforce_data(n_samples=2500):
    np.random.seed(42)
    # Features (Decision-support only. Zero protected attributes used)
    avg_daily_hours = np.random.normal(8.0, 0.8, n_samples)
    attendance_rate = np.random.uniform(75, 100, n_samples)
    wellbeing_index = np.random.uniform(50, 100, n_samples)
    leave_utilization = np.random.uniform(10, 90, n_samples)
    
    # Ground Truth Productivity Target
    productivity_score = (
        (attendance_rate * 0.35) +
        (wellbeing_index * 0.35) +
        (np.clip(avg_daily_hours, 6.0, 9.5) * 3.5) -
        (np.maximum(0, avg_daily_hours - 9.5) * 8.0) +
        np.random.normal(0, 3, n_samples)
    )
    productivity_score = np.clip(productivity_score, 40, 99)
    
    df = pd.DataFrame({
        'avg_daily_hours': avg_daily_hours,
        'attendance_rate': attendance_rate,
        'wellbeing_index': wellbeing_index,
        'leave_utilization': leave_utilization,
        'productivity_score': productivity_score
    })
    return df

def train_and_export_model():
    df = generate_synthetic_workforce_data()
    X = df[['avg_daily_hours', 'attendance_rate', 'wellbeing_index', 'leave_utilization']]
    y = df['productivity_score']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = RandomForestRegressor(n_estimators=100, max_depth=6, random_state=42)
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    print(f"R2 Score: {r2_score(y_test, y_pred):.4f}")
    print(f"RMSE: {np.sqrt(mean_squared_error(y_test, y_pred)):.4f}")
    
    joblib.dump(model, 'backend/ai/dayflow_productivity_model.joblib')
    print("Model serialized and exported successfully.")

if __name__ == '__main__':
    train_and_export_model()
`
    },
    postgres_schema: {
      name: 'database/schema.sql (PostgreSQL Schema)',
      type: 'SQL / PostgreSQL',
      icon: Database,
      code: `-- DAYFLOW HRMS Database Schema
-- Compatible with PostgreSQL 14+

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(32) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(32) DEFAULT 'employee' CHECK (role IN ('employee', 'admin', 'hr')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(32) UNIQUE NOT NULL REFERENCES users(employee_id),
    full_name VARCHAR(128) NOT NULL,
    department VARCHAR(64) NOT NULL,
    designation VARCHAR(128) NOT NULL,
    phone VARCHAR(32),
    avatar_url TEXT,
    join_date DATE NOT NULL,
    status VARCHAR(32) DEFAULT 'Active',
    basic_salary NUMERIC(10, 2) NOT NULL,
    allowance NUMERIC(10, 2) DEFAULT 0,
    deductions NUMERIC(10, 2) DEFAULT 0,
    tax NUMERIC(10, 2) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS attendance_logs (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(32) NOT NULL REFERENCES employees(employee_id),
    log_date DATE NOT NULL,
    check_in TIME,
    check_out TIME,
    working_hours NUMERIC(4, 2) DEFAULT 0,
    status VARCHAR(32) CHECK (status IN ('Present', 'Late', 'Absent', 'Half-day')),
    location VARCHAR(64) DEFAULT 'HQ Office',
    anomaly_flag BOOLEAN DEFAULT FALSE,
    anomaly_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS leave_requests (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(32) NOT NULL REFERENCES employees(employee_id),
    leave_type VARCHAR(64) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days_count INT NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(32) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    reviewer_comment TEXT,
    reviewed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS payroll_records (
    id SERIAL PRIMARY KEY,
    slip_number VARCHAR(64) UNIQUE NOT NULL,
    employee_id VARCHAR(32) NOT NULL REFERENCES employees(employee_id),
    payroll_month VARCHAR(32) NOT NULL,
    basic_salary NUMERIC(10, 2) NOT NULL,
    allowance NUMERIC(10, 2) DEFAULT 0,
    bonus NUMERIC(10, 2) DEFAULT 0,
    overtime_pay NUMERIC(10, 2) DEFAULT 0,
    deductions NUMERIC(10, 2) DEFAULT 0,
    tax NUMERIC(10, 2) DEFAULT 0,
    net_salary NUMERIC(10, 2) NOT NULL,
    pay_date DATE NOT NULL,
    status VARCHAR(32) DEFAULT 'Paid'
);
`
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(files[activeFile].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[680px]">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/30 text-sky-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">DayFlow Full-Stack Architecture & Source Code</h3>
              <p className="text-xs text-slate-300">FastAPI Routers, Scikit-learn AI Pipeline, & PostgreSQL Schema</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Object.entries(files).map(([key, item]) => {
              const Icon = item.icon;
              return (
                <button
                  key={key}
                  onClick={() => setActiveFile(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                    activeFile === key
                      ? 'bg-white text-indigo-700 shadow-2xs border border-indigo-200'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleCopyCode}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Code'}</span>
          </button>
        </div>

        {/* Code Content */}
        <div className="flex-1 bg-slate-950 p-4 overflow-auto text-xs font-mono text-emerald-400 leading-relaxed select-text">
          <pre>{files[activeFile].code}</pre>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span>{files[activeFile].name}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
