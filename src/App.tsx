import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material'
import EmployeesPage from './pages/Employees/EmployeesPage'
import AnalyticsPage from './pages/Analytics/AnalyticsPage'

function App() {
    return (
        <BrowserRouter>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            HR Dashboard 2.0
                        </Typography>
                        <Button color="inherit" component={NavLink} to="/">
                            Сотрудники
                        </Button>
                        <Button color="inherit" component={NavLink} to="/analytics">
                            Аналитика
                        </Button>
                    </Toolbar>
                </AppBar>

                <Box sx={{ p: 3 }}>
                    <Routes>
                        <Route path="/" element={<EmployeesPage />} />
                        <Route path="/analytics" element={<AnalyticsPage />} />
                    </Routes>
                </Box>
            </Box>
        </BrowserRouter>
    )
}

export default App