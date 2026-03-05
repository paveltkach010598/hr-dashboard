import type { Employee } from '../types/employee'

export function filterEmployees(employees: Employee[], department: string): Employee[] {
    if (department === 'Все') return employees
    return employees.filter((e) => e.department === department)
}