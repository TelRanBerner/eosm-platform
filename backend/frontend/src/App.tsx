import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import UserTicketsPage from './pages/UserTicketsPage';
import MailPage from './pages/MailPage';
import { IUser } from "./types";

function App() {
    const [user, setUser] = useState<IUser | null>(() => {
        const saved = localStorage.getItem('user_data');
        try {
            return saved ? JSON.parse(saved) : null;
        } catch { return null; }
    });

    const handleAuth = (userData: IUser | null) => {
        setUser(userData);
        if (userData) {
            localStorage.setItem('user_data', JSON.stringify(userData));
        } else {
            localStorage.removeItem('user_data'); // Чистим только данные юзера
        }
    };

    return (
        <Router>
            <Routes>
                {/* ПУБЛИЧНЫЕ РОУТЫ (для неавторизованных) */}
                {!user ? (
                    <>
                        <Route path="/login" element={<LoginPage setAuth={handleAuth} />} />
                        <Route path="/register" element={<RegisterPage />} />
                        {/* Любой другой путь кидает на логин */}
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </>
                ) : (
                    /* ЗАЩИЩЕННЫЕ РОУТЫ (внутри Layout) */
                    <Route element={<Layout user={user} />}>
                        {/* Если пользователь нажал на "Домой", но мы хотим разлогинить его */}
                        <Route path="/home" element={<Navigate to="/login" replace />} />

                        <Route path="/my-tickets" element={<UserTicketsPage user={user} />} />
                        <Route path="/incidents" element={<UserTicketsPage user={user} />} />
                        <Route path="/dashboard" element={<DashboardPage user={user} />} />
                        <Route path="/mail" element={<MailPage />} />

                        {/* Главная страница для вошедшего юзера — его тикеты */}
                        <Route path="/" element={<Navigate to="/my-tickets" replace />} />
                        {/* 404 для вошедшего юзера тоже ведет на тикеты */}
                        <Route path="*" element={<Navigate to="/my-tickets" replace />} />
                    </Route>
                )}
            </Routes>
        </Router>
    );
}

export default App;