import { describe, it, expect } from 'vitest'
import { filterEmployees } from './filterEmployees'
import type { Employee } from '../types/employee'

const mockEmployees: Employee[] = [
    { id: 1, name: 'Иван Петров', department: 'Frontend', position: 'Junior', status: 'active', salary: 95000, startDate: '2022-07-01' },
    { id: 2, name: 'Мария Козлова', department: 'Backend', position: 'Middle', status: 'active', salary: 130000, startDate: '2021-11-20' },
    { id: 3, name: 'Алексей Морозов', department: 'Frontend', position: 'Middle', status: 'active', salary: 150000, startDate: '2021-04-12' },
    { id: 4, name: 'Анна Смирнова', department: 'HR', position: 'HR-менеджер', status: 'inactive', salary: 85000, startDate: '2022-03-15' },
]

describe('filterEmployees', () => {
    it('возвращает всех сотрудников если выбрано "Все"', () => {
        const result = filterEmployees(mockEmployees, 'Все')
        expect(result).toHaveLength(4)
        expect(result).toEqual(mockEmployees)
    })

    it('фильтрует сотрудников по отделу', () => {
        const result = filterEmployees(mockEmployees, 'Frontend')
        expect(result).toHaveLength(2)
        expect(result.every((e) => e.department === 'Frontend')).toBe(true)
    })

    it('возвращает пустой массив если в отделе нет сотрудников', () => {
        const result = filterEmployees(mockEmployees, 'DevOps')
        expect(result).toHaveLength(0)
    })

    it('не мутирует исходный массив', () => {
        const original = [...mockEmployees]
        filterEmployees(mockEmployees, 'Frontend')
        expect(mockEmployees).toEqual(original)
    })
})