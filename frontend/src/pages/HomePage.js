import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Импортируем хук

const HomePage = () => {
    const [status, setStatus] = useState('Unknown');
    const navigate = useNavigate(); // 2. Создаем функцию навигации

    const checkServerHealth = async () => {
        try {
            const response = await fetch('http://localhost:5000/health');
            const data = await response.json();
            setStatus(data.status + ": " + data.message);
        } catch (error) {
            setStatus('Error: Server is offline');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>EOSM Platform - Home</h1>
            <button onClick={checkServerHealth}>Health Check</button>
            <p>Server Status: <strong>{status}</strong></p>

            <nav style={{ marginTop: '20px' }}>
                {/* 3. Используем navigate вместо window.location */}
                <button onClick={() => navigate('/dashboard')}>
                    Перейти в Dashboard
                </button>
            </nav>
        </div>
    );
};

export default HomePage;