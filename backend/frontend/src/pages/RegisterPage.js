import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Наш настроенный axios
import './styles/LoginPage.css';

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
            await api.post('/auth/register', {
                name: formData.name,      // БЫЛО fullName, СТАЛО name (как в схеме)
                email: formData.email,
                password: formData.password // Это уйдет в контроллер для шифрования
            });

            alert('Registration successful! Please login.');
            navigate('/');

        } catch (err) {
            // Вытаскиваем конкретную ошибку валидации (например, "Пароль слишком короткий")
            const errorData = err.response?.data;
            const message = errorData?.errors?.[0]?.msg || errorData?.message || 'Ошибка соединения';
            setError(message);
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
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>

                    <div className="input-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="name@eosm.com"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Create password"
                            required
                            value={formData.password}
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
            {/* Декор */}
            <div className="bg-glow-1"></div>
            <div className="bg-glow-2"></div>
        </div>
    );
};

export default RegisterPage;