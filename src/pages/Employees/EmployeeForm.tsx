import {
    Box, Button, TextField, MenuItem, Typography,
    Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { useAddEmployeeMutation } from '../../api/employeesApi'
import type { Employee } from '../../types/employee'

type FormData = Omit<Employee, 'id'>

const departments = ['Frontend', 'Backend', 'HR', 'QA', 'DevOps']
const statuses = [
    { value: 'active', label: 'Активен' },
    { value: 'inactive', label: 'Неактивен' },
]

interface Props {
    open: boolean
    onClose: () => void
}

function EmployeeForm({ open, onClose }: Props) {
    const [addEmployee, { isLoading }] = useAddEmployeeMutation()

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            name: '',
            department: '',
            position: '',
            status: 'active',
            salary: 0,
            startDate: '',
        },
    })

    const onSubmit = async (data: FormData) => {
        try {
            await addEmployee(data).unwrap()
            reset()
            onClose()
        } catch (error) {
            console.error('Ошибка при добавлении сотрудника:', error)
        }
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Новый сотрудник</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>

                    <Controller
                        name="name"
                        control={control}
                        rules={{ required: 'Введите имя' }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Имя"
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />
                        )}
                    />

                    <Controller
                        name="department"
                        control={control}
                        rules={{ required: 'Выберите отдел' }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                label="Отдел"
                                error={!!errors.department}
                                helperText={errors.department?.message}
                            >
                                {departments.map((dep) => (
                                    <MenuItem key={dep} value={dep}>{dep}</MenuItem>
                                ))}
                            </TextField>
                        )}
                    />

                    <Controller
                        name="position"
                        control={control}
                        rules={{ required: 'Введите должность' }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Должность"
                                error={!!errors.position}
                                helperText={errors.position?.message}
                            />
                        )}
                    />

                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <TextField {...field} select label="Статус">
                                {statuses.map((s) => (
                                    <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                                ))}
                            </TextField>
                        )}
                    />

                    <Controller
                        name="salary"
                        control={control}
                        rules={{ required: 'Введите зарплату', min: { value: 1, message: 'Зарплата должна быть больше 0' } }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                label="Зарплата"
                                type="number"
                                error={!!errors.salary}
                                helperText={errors.salary?.message}
                            />
                        )}
                    />

                    <Controller
                        name="startDate"
                        control={control}
                        rules={{ required: 'Введите дату' }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Дата найма"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                error={!!errors.startDate}
                                helperText={errors.startDate?.message}
                            />
                        )}
                    />

                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Отмена</Button>
                <Button onClick={handleSubmit(onSubmit)} variant="contained" disabled={isLoading}>
                    {isLoading ? 'Сохранение...' : 'Добавить'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default EmployeeForm