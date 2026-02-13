const jwt = require('jsonwebtoken');

// Секретный ключ (в реальном проекте вынеси в .env)
const JWT_SECRET = 'super-secret-eosm-key';

exports.login = (req, res) => {
    const { email, password } = req.body;

    // Мок авторизации: admin@eosm.com / admin123
    if (email === 'admin@eosm.com' && password === 'admin123') {
        const token = jwt.sign(
            { email, role: 'admin' },
            JWT_SECRET,
            { expiresIn: '15m' }
        );

        // Передача через cookie (пункт 11 задания)
        res.cookie('token', token, {
            httpOnly: true, // Защита от XSS
            secure: false,  // Для локальной разработки по HTTP
            maxAge: 15 * 60 * 1000 // 15 минут
        });

        return res.json({ success: true, role: 'admin' });
    }

    res.status(401).json({ message: 'Invalid credentials' });
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
};