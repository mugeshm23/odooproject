from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Dayflow HRMS API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# Employee model
class Employee(BaseModel):
    id: int | None = None
    name: str
    email: str
    role: str
    department: str
    status: str = "Active"


# Sample employee data
employees = [
    {
        "id": 1,
        "name": "Hasan",
        "email": "hasan@dayflow.com",
        "role": "Employee",
        "department": "IT",
        "status": "Active"
    },
    {
        "id": 2,
        "name": "Sugumaran",
        "email": "sugumaran@dayflow.com",
        "role": "Employee",
        "department": "Development",
        "status": "Active"
    },
    {
        "id": 3,
        "name": "Harisanth",
        "email": "harisanth@dayflow.com",
        "role": "HR",
        "department": "HR",
        "status": "Active"
    },
    {
        "id": 4,
        "name": "Mugesh",
        "email": "mugesh@dayflow.com",
        "role": "Manager",
        "department": "Management",
        "status": "Active"
    }
]


# Home
@app.get("/")
def home():
    return {
        "message": "Dayflow HRMS API is running",
        "status": "success"
    }


# Dashboard
@app.get("/api/dashboard")
def dashboard():

    total = len(employees)
    active = sum(e["status"] == "Active" for e in employees)
    inactive = total - active

    departments = {}

    for employee in employees:
        dept = employee["department"]
        departments[dept] = departments.get(dept, 0) + 1

    return {
        "total_employees": total,
        "active_employees": active,
        "inactive_employees": inactive,
        "departments": departments,
        "attendance": {
            "present": 32,
            "absent": 4,
            "late": 3
        },
        "leave": {
            "pending": 5,
            "approved": 8,
            "rejected": 2
        }
    }


# Get all employees
@app.get("/api/employees")
def get_employees(department: str | None = None):

    if department:
        result = [
            e for e in employees
            if e["department"].lower() == department.lower()
        ]
    else:
        result = employees

    return {
        "count": len(result),
        "employees": result
    }


# Get employee by ID
@app.get("/api/employees/{employee_id}")
def get_employee(employee_id: int):

    for employee in employees:
        if employee["id"] == employee_id:
            return employee

    raise HTTPException(
        status_code=404,
        detail="Employee not found"
    )


# Search employee
@app.get("/api/search")
def search_employee(name: str):

    result = [
        employee for employee in employees
        if name.lower() in employee["name"].lower()
    ]

    return {
        "count": len(result),
        "employees": result
    }


# Add employee
@app.post("/api/employees")
def add_employee(employee: Employee):

    # Check duplicate email
    for existing in employees:
        if existing["email"].lower() == employee.email.lower():
            raise HTTPException(
                status_code=400,
                detail="Email already exists"
            )

    new_id = max([e["id"] for e in employees], default=0) + 1

    new_employee = employee.model_dump()
    new_employee["id"] = new_id

    employees.append(new_employee)

    return {
        "message": "Employee added successfully",
        "employee": new_employee
    }


# Update employee
@app.put("/api/employees/{employee_id}")
def update_employee(
    employee_id: int,
    updated_employee: Employee
):

    for employee in employees:

        if employee["id"] == employee_id:

            employee.update({
                "name": updated_employee.name,
                "email": updated_employee.email,
                "role": updated_employee.role,
                "department": updated_employee.department,
                "status": updated_employee.status
            })

            return {
                "message": "Employee updated successfully",
                "employee": employee
            }

    raise HTTPException(
        status_code=404,
        detail="Employee not found"
    )


# Delete employee
@app.delete("/api/employees/{employee_id}")
def delete_employee(employee_id: int):

    for employee in employees:

        if employee["id"] == employee_id:

            employees.remove(employee)

            return {
                "message": "Employee deleted successfully"
            }

    raise HTTPException(
        status_code=404,
        detail="Employee not found"
    )
