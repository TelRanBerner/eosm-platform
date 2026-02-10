import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import './Layout.css';

const Layout = () => {
    const [serverStatus, setServerStatus] = useState('checking'); // 'online', 'offline', 'checking'

    useEffect(() => {
        const checkHealth = async () => {
            try {
                // Стучимся в созданный нами ранее /health эндпоинт
                const response = await fetch('http://localhost:5000/health');
                if (response.ok) {
                    setServerStatus('online');
                } else {
                    setServerStatus('offline');
                }
            } catch (error) {
                setServerStatus('offline');
            }
        };

        checkHealth();
        // Проверяем статус каждые 30 секунд
        const interval = setInterval(checkHealth, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="app-layout">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <span className="logo-icon">🛰</span>
                    <span className="logo-text">EOSM</span>
                </div>

                {/* Индикатор статуса сервера */}
                <div className="status-indicator">
                    <span className={`dot ${serverStatus}`}></span>
                    <span className="status-text">
                        {serverStatus === 'online' ? 'SYSTEM ONLINE' :
                            serverStatus === 'offline' ? 'SYSTEM OFFLINE' : 'CHECKING...'}
                    </span>
                </div>

                <nav className="sidebar-nav">
                    <Link to="/dashboard" className="nav-item">📊 Dashboard</Link>
                    <Link to="/incidents" className="nav-item">🚨 Incidents</Link>
                </nav>

                <div className="sidebar-footer">
                    <Link to="/" className="logout-btn">Exit System</Link>
                </div>
            </aside>
            <main className="content-area">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;