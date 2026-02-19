const jwt = require('jsonwebtoken');
const JWT_SECRET = 'eosm_super_secret_key_2026';

const users = [
    { id: '1', email: 'admin@eosm.com', password: '123', role: 'admin', name: 'System Admin' },
    { id: '2', email: 'user@eosm.com', password: '123', role: 'user', name: 'Satellite Operator' },
    { id: '3', email: 'support@eosm.com', password: '123', role: 'support', name: 'Tech Support' },
    { id: '4', email: 'engineer@eosm.com', password: '123', role: 'engineer', name: 'Orbital Engineer' }
];

exports.login = (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(401).json({ error: 'Неверный email или пароль' });
    }


    const userId = user.id || user._id || email;

    const token = jwt.sign(
        {
            id: userId,
            email: user.email,
            role: user.role,
            name: user.name
        },
        JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 3600000
    });

    res.json({
        success: true,
        user: { id: userId, email: user.email, role: user.role, name: user.name }
    });
};

exports.logout = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (token) {
            // Рассчитываем время жизни токена (например, 1 час)
            // И кладем его в Redis с пометкой "blacklisted"
            await global.redisClient.setEx(`bl_${token}`, 3600, 'true');
        }

        res.clearCookie('token');
        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Logout failed' });
    }
};

exports.register = (req, res) => {
    const { email, password, role, name } = req.body;
    const newUser = { email, password, role, name };
    users.push(newUser); // Мок сохранения
    res.status(201).json({ success: true, message: 'User registered' });
};