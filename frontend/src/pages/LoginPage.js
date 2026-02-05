// import React from 'react';
//
// const LoginPage = () => {
//     return (
//         <div style={{ padding: '20px' }}>
//             <h2>Login Page</h2>
//             <input type="text" placeholder="Username" /><br/><br/>
//             <input type="password" placeholder="Password" /><br/><br/>
//             <button onClick={() => window.location.href = '/home'}>Login</button>
//         </div>
//     );
// };
//
// export default LoginPage;




import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/dashboard'); // Переход в систему
    };

    return (
        <div className="login-container">
            <div className="login-glass-card">
                <h1 className="dashboard-title">EOSM TERMINAL</h1>
                <p className="system-status">System Status: <span className="status-online">READY</span></p>
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <label>OPERATOR ID</label>
                        <input type="text" placeholder="ENTR ID..." required />
                    </div>
                    <div className="input-group">
                        <label>ACCESS KEY</label>
                        <input type="password" placeholder="••••••••" required />
                    </div>
                    <button type="submit" className="login-btn-submit">INITIATE SESSION</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
