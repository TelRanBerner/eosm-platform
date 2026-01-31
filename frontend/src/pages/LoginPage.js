import React from 'react';

const LoginPage = () => {
    return (
        <div style={{ padding: '20px' }}>
            <h2>Login Page</h2>
            <input type="text" placeholder="Username" /><br/><br/>
            <input type="password" placeholder="Password" /><br/><br/>
            <button onClick={() => window.location.href = '/home'}>Login</button>
        </div>
    );
};

export default LoginPage;