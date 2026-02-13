import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Отправляем данные (роль 'user' добавится на сервере по умолчанию)
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, role: 'user' })
            });

            if (response.ok) {
                alert('Registration successful! Please login.');
                navigate('/');
            } else {
                const data = await response.json();
                setError(data.error || 'Registration failed');
            }
        } catch (err) {
            setError('Server connection error');
        }
    };

    return (
        <div className="login-container">
            <div className="login-glass-card register-card">
                <div className="login-header">
                    <div className="logo-icon">🚀</div>
                    <h1>JOIN EOSM</h1>
                    <p>Create your account</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            required
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>

                    <div className="input-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="name@eosm.com"
                            required
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Create password"
                            required
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </div>

                    {error && <div className="login-error-msg">⚠️ {error}</div>}

                    <button type="submit" className="login-submit-btn">
                        Create Account
                    </button>
                </form>

                <div className="login-footer">
                    <p>Already a member? <span className="register-link" onClick={() => navigate('/')}>Login here</span></p>
                </div>
            </div>
            <div className="bg-glow-1"></div>
            <div className="bg-glow-2"></div>
        </div>
    );
};

export default RegisterPage;