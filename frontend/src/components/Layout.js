import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import './Layout.css';
import { isAdmin, isSupport, isEngineer, isUser } from '../utils/checkRoles';   

const Layout = () => {
    const user = {role: 'admin'};
    return (
        <div className="app-layout">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <span className="logo-icon">🛰</span>
                    <span className="logo-text">EOSM</span>
                </div>
                <nav className="sidebar-nav">
                    {!isUser(user) && (
                        <>
                            <Link to="/dashboard" className="nav-item">📊 Dashboard</Link>
                            <Link to="/incidents" className="nav-item">🚨 Incidents</Link>
                            <Link to="/analytics" className="nav-item">📈 Analytics</Link>
                        </>
                    )}
                    {isUser(user) && (
                        <>
                            <Link to="/create-ticket" className="nav-item">📊 Create ticket</Link>
                        </>
                    )}
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