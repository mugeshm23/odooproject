from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Dayflow HRMS API")

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Employee(BaseModel):
    id: int
    name: str
    email: str
    role: str
    department: str
    status: str = "Active"

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


@app.get("/")
def home():
    return {
        "message": "Dayflow HRMS API is running",
        "status": "success"
    }


@app.get("/api/employees")
def get_employees():
    return {
        "count": len(employees),
        "employees": employees
    }


@app.get("/api/employees/{employee_id}")
def get_employee(employee_id: int):

    for employee in employees:
        if employee["id"] == employee_id:
            return employee

    raise HTTPException(
        status_code=404,
        detail="Employee not found"
    )


@app.post("/api/employees")
def add_employee(employee: Employee):

    employees.append(employee.model_dump())

    return {
        "message": "Employee added successfully",
        "employee": employee
    }


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
