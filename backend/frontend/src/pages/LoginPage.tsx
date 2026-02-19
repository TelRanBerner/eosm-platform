import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

import './styles/LoginPage.css';
import {IUser} from "../types";
interface LoginPageProps {
    setAuth: (user: IUser | null) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ setAuth }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const { data } = await api.post<IUser>('/auth/login', {
                email,
                password
            });

            if (data.token) {
                window.localStorage.setItem('token', data.token);
                setAuth(data);
                navigate('/home');
            }
        } catch (err: any) {
            const message = err.response?.data?.message || 'Access Denied';
            setError(message);
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
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Security Key</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="login-error-msg">⚠️ {error}</div>}

                    <button type="submit" className="login-submit-btn">
                        Authorize Access
                    </button>
                </form>

                <div className="login-footer">
                    <p>
                        Don't have an account?{' '}
                        <span className="register-link" onClick={() => navigate('/register')}>
                            Request Access
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;