import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { IUser } from '../types';
import './Layout.css';

interface LayoutProps {
    user: IUser | null;
}

type ServerStatus = 'online' | 'offline' | 'checking';

const Layout: React.FC<LayoutProps> = ({ user }) => {
    const [serverStatus, setServerStatus] = useState<ServerStatus>('checking');
    const navigate = useNavigate();

    // Мониторинг здоровья сервера
    useEffect(() => {
        const checkHealth = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/health');
                setServerStatus(response.ok ? 'online' : 'offline');
            } catch {
                setServerStatus('offline');
            }
        };
        checkHealth();
        const interval = setInterval(checkHealth, 30000);
        return () => clearInterval(interval);
    }, []);

    // Очистка сессии и выход
    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    // Переход на Home (динамический редирект из App.tsx)
    const handleHome = () => {
        localStorage.clear(); // Очищаем данные
        window.location.href = '/login'; // Ведем на вход
    };

    return (
        <div className="app-layout">
            <aside className="sidebar">
                <div className="sidebar-top-section">
                    <div className="sidebar-header">
                        <span className="logo-icon">🛰</span>
                        <span className="logo-text">EOSM</span>
                    </div>

                    <div className="status-indicator">
                        <span className={`dot ${serverStatus}`}></span>
                        <span className="status-text">
                            {serverStatus === 'online' ? 'SYSTEM ONLINE' : 'OFFLINE'}
                        </span>
                    </div>

                    <div className="user-profile-mini">
                        <span className="user-avatar">👤</span>
                        <span className="user-name-text">{user?.name || 'Operator'}</span>
                    </div>

                    <nav className="sidebar-nav">
                        {/* Важно: Пути Link to соответствуют Route path в App.tsx */}
                        <Link to="/my-tickets" className="nav-item">📂 My Tickets</Link>

                        <Link to="/mail" className="nav-item mail-link">
                            <span>📧 New Mail</span>
                            <span className="mail-badge">New</span>
                        </Link>

                        {/* Секция только для персонала */}
                        {(user?.role === 'admin' || user?.role === 'engineer') && (
                            <>
                                <Link to="/dashboard" className="nav-item">📊 Dashboard</Link>
                                <Link to="/incidents" className="nav-item">🚨 Incidents Log</Link>
                            </>
                        )}
                    </nav>
                </div>

                <div className="sidebar-footer">
                    {/* Твои обновленные кнопки */}
                    <button onClick={handleHome} className="nav-btn home-btn">🏠 Home</button>
                    <button onClick={handleLogout} className="nav-btn logout-btn">🚪 Logout</button>
                </div>
            </aside>

            {/* ОСНОВНАЯ ОБЛАСТЬ (Сюда отрисовываются UserTicketsPage и MailPage) */}
            <main className="content-area">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;