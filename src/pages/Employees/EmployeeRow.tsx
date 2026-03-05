import { TableRow, TableCell, Chip, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { memo } from 'react'
import type { Employee } from '../../types/employee'

interface Props {
    employee: Employee
    onDelete: (id: number) => void
}

const EmployeeRow = memo(({ employee, onDelete }: Props) => {
    return (
        <TableRow>
            <TableCell>{employee.name}</TableCell>
            <TableCell>{employee.department}</TableCell>
            <TableCell>{employee.position}</TableCell>
            <TableCell>
                <Chip
                    label={employee.status === 'active' ? 'Активен' : 'Неактивен'}
                    color={employee.status === 'active' ? 'success' : 'default'}
                    size="small"
                />
            </TableCell>
            <TableCell>{employee.salary.toLocaleString()} ₽</TableCell>
            <TableCell>{employee.startDate}</TableCell>
            <TableCell>
                <IconButton color="error" onClick={() => onDelete(employee.id)}>
                    <DeleteIcon />
                </IconButton>
            </TableCell>
        </TableRow>
    )
})

EmployeeRow.displayName = 'EmployeeRow'

export default EmployeeRow