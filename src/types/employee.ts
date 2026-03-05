export interface Employee {
    id: number
    name: string
    department: string
    position: string
    status: 'active' | 'inactive'
    salary: number
    startDate: string
}