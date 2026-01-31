import React, { useState } from 'react';

const HomePage = () => {
    const [status, setStatus] = useState('Unknown');

    const checkServerHealth = async () => {
        try {
            // Запрос к нашему бэкенду (Node.js)
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
        </div>
    );
};

export default HomePage;