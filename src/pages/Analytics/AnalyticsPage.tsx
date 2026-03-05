import { Box, Typography, Paper } from '@mui/material'
import ReactECharts from 'echarts-for-react'
import { useGetEmployeesQuery } from '../../api/employeesApi'
import { useMemo } from 'react'

function AnalyticsPage() {
    const { data: employees = [] } = useGetEmployeesQuery()

    const departmentData = useMemo(() => {
        const counts: Record<string, number> = {}
        employees.forEach((e) => {
            counts[e.department] = (counts[e.department] ?? 0) + 1
        })
        return Object.entries(counts).map(([name, value]) => ({ name, value }))
    }, [employees])

    const salaryData = useMemo(() => {
        const departments: Record<string, number[]> = {}
        employees.forEach((e) => {
            if (!departments[e.department]) departments[e.department] = []
            departments[e.department].push(e.salary)
        })
        return Object.entries(departments).map(([dep, salaries]) => ({
            department: dep,
            avg: Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length),
        }))
    }, [employees])

    const pieOption = {
        title: { text: 'Сотрудники по отделам', left: 'center' },
        tooltip: { trigger: 'item' },
        series: [{
            type: 'pie',
            radius: '60%',
            data: departmentData,
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
            },
        }],
    }

    const barOption = {
        title: { text: 'Средняя зарплата по отделам', left: 'center' },
        tooltip: { trigger: 'axis' },
        xAxis: {
            type: 'category',
            data: salaryData.map((d) => d.department),
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: (val: number) => `${(val / 1000).toFixed(0)}к ₽`,
            },
        },
        series: [{
            type: 'bar',
            data: salaryData.map((d) => d.avg),
            itemStyle: { color: '#1976d2' },
        }],
    }

    return (
        <Box>
            <Typography variant="h5" mb={3}>Аналитика</Typography>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Paper sx={{ p: 2, flex: 1, minWidth: 300 }}>
                    <ReactECharts option={pieOption} style={{ height: 350 }} />
                </Paper>
                <Paper sx={{ p: 2, flex: 1, minWidth: 300 }}>
                    <ReactECharts option={barOption} style={{ height: 350 }} />
                </Paper>
            </Box>
        </Box>
    )
}

export default AnalyticsPage