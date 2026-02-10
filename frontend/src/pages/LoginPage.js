import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = ({ setAuth }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                setAuth(data.user);
                navigate('/home');

            } else {
                setError(data.error || 'Access Denied');
            }
        } catch (err) {
            setError('Server connection failed');
        }
    };

    return (
        <div className="login-container">
            <div className="login-glass-card">
                <div className="login-header">
                    <div className="logo-icon">🛰</div>
                    <h1>EOSM</h1>
                    <p>Satellite Monitoring System</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <label>Operational Email</label>
                        <input
                            type="email"
                            placeholder="name@eosm.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Security Key</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="login-error-msg">⚠️ {error}</div>}

                    <button type="submit" className="login-submit-btn">
                        Authorize Access
                    </button>
                </form>

                {/* Блок перехода на регистрацию  */}
                <div className="login-footer">
                    <p>
                        Don't have an account?{' '}
                        <span className="register-link" onClick={() => navigate('/register')}>
                            Request Access
                        </span>
                    </p>
                    <div className="encryption-tag">Secure Quantum Encrypted Session</div>
                </div>
            </div>

            <div className="bg-glow-1"></div>
            <div className="bg-glow-2"></div>
        </div>
    );
};

export default LoginPage;