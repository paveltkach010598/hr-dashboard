import { useState, useMemo, useCallback } from 'react'
import {
    Box, Typography, Table, TableBody,
    TableContainer, TableHead, TableRow, Paper,
    Chip, CircularProgress, Button,
    TextField, MenuItem, TableCell
} from '@mui/material'
import { useGetEmployeesQuery, useDeleteEmployeeMutation } from '../../api/employeesApi'
import EmployeeForm from './EmployeeForm'
import EmployeeRow from './EmployeeRow'

const departments = ['Все', 'Frontend', 'Backend', 'HR', 'QA', 'DevOps']

function EmployeesPage() {
    const { data: employees, isLoading, isError } = useGetEmployeesQuery()
    const [deleteEmployee] = useDeleteEmployeeMutation()
    const [formOpen, setFormOpen] = useState(false)
    const [selectedDepartment, setSelectedDepartment] = useState('Все')

    const filteredEmployees = useMemo(() => {
        if (selectedDepartment === 'Все') return employees ?? []
        return (employees ?? []).filter((e) => e.department === selectedDepartment)
    }, [employees, selectedDepartment])

    const handleDelete = useCallback(async (id: number) => {
        if (window.confirm('Удалить сотрудника?')) {
            await deleteEmployee(id)
        }
    }, [deleteEmployee])

    if (isLoading) return <CircularProgress />
    if (isError) return <Chip label="Ошибка загрузки" color="error" />

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span style={{ fontSize: 24, fontWeight: 600 }}>Сотрудники</span>
                    <Chip label={filteredEmployees.length} size="small" />
                </Box>
                <Button variant="contained" onClick={() => setFormOpen(true)}>
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

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Имя</TableCell>
                            <TableCell>Отдел</TableCell>
                            <TableCell>Должность</TableCell>
                            <TableCell>Статус</TableCell>
                            <TableCell>Зарплата</TableCell>
                            <TableCell>Дата найма</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredEmployees.map((employee) => (
                            <EmployeeRow
                                key={employee.id}
                                employee={employee}
                                onDelete={handleDelete}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <EmployeeForm open={formOpen} onClose={() => setFormOpen(false)} />
        </Box>
    )
}

export default EmployeesPage