
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage'; 

function App() {
    return (
        <Router>
            <Routes>
                {/* Публичный маршрут (без сайдбара) */}
                <Route path="/" element={<LoginPage />} />

                {/* Защищенные маршруты (внутри Layout) */}
                <Route element={<Layout />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/incidents" element={<div>Incident Management (In Dev)</div>} />
                    <Route path="/analytics" element={<div>Analytics Center (In Dev)</div>} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;