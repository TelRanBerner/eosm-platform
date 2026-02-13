import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import UserTicketsPage from './pages/UserTicketsPage';

function App() {
    const [user, setUser] = useState(null);

    return (
        <Router>
            <Routes>
                {/* Публичные маршруты */}
                <Route path="/" element={<LoginPage setAuth={setUser} />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Защищенная зона */}
                <Route element={user ? <Layout user={user} /> : <Navigate to="/" replace />}>

                    {/* Доступ для обычных пользователей (Operators) */}
                    {user?.role === 'user' && (
                        <Route path="/my-tickets" element={<UserTicketsPage user={user} />} />
                    )}

                    {/* Доступ для персонала (Command Center) и Админа */}
                    {(user?.role === 'support' || user?.role === 'engineer' || user?.role === 'admin') && (
                        <>
                            <Route path="/dashboard" element={<DashboardPage user={user} />} />
                            {/* Теперь админ видит страницу управления инцидентами вместо белой заглушки */}
                            <Route path="/incidents" element={<UserTicketsPage user={user} />} />
                        </>
                    )}

                    {/* Умный редирект */}
                    <Route path="/home" element={
                        user?.role === 'user' ? <Navigate to="/my-tickets" /> : <Navigate to="/dashboard" />
                    } />

                    <Route path="*" element={<Navigate to="/home" replace />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;