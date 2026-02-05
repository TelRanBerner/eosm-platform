import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import './Layout.css';

const Layout = () => {
    return (
        <div className="app-layout">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <span className="logo-icon">🛰</span>
                    <span className="logo-text">EOSM</span>
                </div>
                <nav className="sidebar-nav">
                    <Link to="/dashboard" className="nav-item">📊 Dashboard</Link>
                    <Link to="/incidents" className="nav-item">🚨 Incidents</Link>
                    <Link to="/analytics" className="nav-item">📈 Analytics</Link>
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