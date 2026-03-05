import { useState, useMemo, useCallback, useRef } from 'react'
import {
    Box, Typography, Paper, Chip, CircularProgress,
    Button, TextField, MenuItem, IconButton
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useGetEmployeesQuery, useDeleteEmployeeMutation } from '../../api/employeesApi'
import type { Employee } from '../../types/employee'
import EmployeeForm from './EmployeeForm'
import EditIcon from '@mui/icons-material/Edit'
import { filterEmployees } from '../../utils/filterEmployees'


const departments = ['Все', 'Frontend', 'Backend', 'HR', 'QA', 'DevOps']
const COLUMNS = ['Имя', 'Отдел', 'Должность', 'Статус', 'Зарплата', 'Дата найма', 'Действия']

function EmployeesPage() {
    const { data: employees, isLoading, isError } = useGetEmployeesQuery()
    const [deleteEmployee] = useDeleteEmployeeMutation()
    const [formOpen, setFormOpen] = useState(false)
    const [selectedDepartment, setSelectedDepartment] = useState('Все')
    const [editEmployee, setEditEmployee] = useState<Employee | undefined>(undefined)

    const handleEdit = useCallback((employee: Employee) => {
        setEditEmployee(employee)
        setFormOpen(true)
    }, [])

    const handleAdd = useCallback(() => {
        setEditEmployee(undefined)
        setFormOpen(true)
    }, [])

    const handleClose = useCallback(() => {
        setEditEmployee(undefined)
        setFormOpen(false)
    }, [])

    const parentRef = useRef<HTMLDivElement>(null)

    const filteredEmployees = useMemo(() => {
        return filterEmployees(employees ?? [], selectedDepartment)
    }, [employees, selectedDepartment])

    const rowVirtualizer = useVirtualizer({
        count: filteredEmployees.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 52,
        overscan: 5,
    })

    const handleDelete = useCallback(async (id: number) => {
        if (window.confirm('Удалить сотрудника?')) {
            await deleteEmployee(id)
        }
    }, [deleteEmployee])

    if (isLoading) return <CircularProgress />
    if (isError) return <Typography color="error">Ошибка загрузки данных</Typography>

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h5">Сотрудники</Typography>
                    <Chip label={filteredEmployees.length} size="small" />
                </Box>
                <Button variant="contained" onClick={handleAdd}>
                    + Добавить сотрудника
                </Button>
            </Box>

            <TextField
                select
                label="Фильтр по отделу"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                sx={{ mb: 2, minWidth: 200 }}
            >
                {departments.map((dep) => (
                    <MenuItem key={dep} value={dep}>{dep}</MenuItem>
                ))}
            </TextField>

            <Paper>
                {/* Заголовок */}
                <Box sx={{ display: 'flex', bgcolor: '#f5f5f5', borderBottom: '2px solid #e0e0e0', py: 1 }}>
                    {COLUMNS.map((col) => (
                        <Box key={col} sx={{ flex: col === 'Имя' || col === 'Должность' ? 2 : 1, px: 2, fontWeight: 'bold', fontSize: 14 }}>
                            {col}
                        </Box>
                    ))}
                </Box>

                {/* Виртуализированный список */}
                <Box
                    ref={parentRef}
                    style={{ height: 400, overflowY: 'auto' }}
                >
                    <Box style={{ height: rowVirtualizer.getTotalSize(), position: 'relative' }}>
                        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                            const employee: Employee = filteredEmployees[virtualRow.index]
                            return (
                                <Box
                                    key={employee.id}
                                    style={{
                                        position: 'absolute',
                                        top: virtualRow.start,
                                        left: 0,
                                        right: 0,
                                        height: virtualRow.size,
                                    }}
                                    sx={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #e0e0e0' }}
                                >
                                    <Box sx={{ flex: 2, px: 2 }}>{employee.name}</Box>
                                    <Box sx={{ flex: 1, px: 2 }}>{employee.department}</Box>
                                    <Box sx={{ flex: 2, px: 2 }}>{employee.position}</Box>
                                    <Box sx={{ flex: 1, px: 2 }}>
                                        <Chip
                                            label={employee.status === 'active' ? 'Активен' : 'Неактивен'}
                                            color={employee.status === 'active' ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </Box>
                                    <Box sx={{ flex: 1, px: 2 }}>{employee.salary.toLocaleString()} ₽</Box>
                                    <Box sx={{ flex: 1, px: 2 }}>{employee.startDate}</Box>
                                    <Box sx={{ flex: 1, px: 2 }}>
                                        <IconButton color="primary" onClick={() => handleEdit(employee)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDelete(employee.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                            )
                        })}
                    </Box>
                </Box>
            </Paper>

            <EmployeeForm open={formOpen} onClose={handleClose} employee={editEmployee} />
        </Box>
    )
}

export default EmployeesPage