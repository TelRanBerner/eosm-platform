const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const JWT_SECRET = 'eosm_super_secret_key_2026';

// 1. Вспомогательная функция логирования (Пункт 9)
const logSecurityEvent = (req, errorType, details = '') => {
    const logDir = path.resolve(__dirname, '../../logs');
    const logPath = path.join(logDir, 'security.log');

    try {
        if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

        const timestamp = new Date().toISOString();
        const clientIP = req.ip || '0.0.0.0';
        const userEmail = req.user?.email || 'Guest';
        const logEntry = `[${timestamp}] ${errorType} | User: ${userEmail} | IP: ${clientIP} | Route: ${req.originalUrl} | Details: ${details}\n`;

        fs.appendFileSync(logPath, logEntry);
    } catch (err) {
        console.error('Ошибка записи лога:', err.message);
    }
};

// 2. Основной Middleware
module.exports = async (req, res, next) => {
    try {
        const token = req.cookies?.token;

        // Проверка на наличие токена
        if (!token) {
            logSecurityEvent(req, '401-UNAUTHORIZED', 'No token found in cookies');
            return res.status(401).json({ error: 'Access denied. Please login.' });
        }

        // --- ПУНКТ 12: ПРОВЕРКА BLACKLIST В REDIS (С ЗАЩИТОЙ ОТ СБОЕВ) ---
        try {
            if (global.redisClient && global.redisClient.isOpen) {
                const isBlacklisted = await global.redisClient.get(`bl_${token}`);
                if (isBlacklisted) {
                    logSecurityEvent(req, '401-BLACKLISTED', 'Token in blacklist');
                    res.clearCookie('token');
                    return res.status(401).json({ error: 'Session invalidated. Please login again.' });
                }
            } else {
                // Если Redis не запущен, просто пишем варнинг в консоль бэкенда
                console.warn('⚠️ Redis не готов! Проверка blacklist пропущена, но сервер работает.');
            }
        } catch (redisErr) {
            console.error('❌ Ошибка Redis при проверке токена:', redisErr.message);
            // Идем дальше, чтобы не блокировать пользователя, если упала только база Redis
        }

        // 3. Верификация JWT
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Передаем данные пользователя дальше в контроллеры
        next();

    } catch (err) {
        logSecurityEvent(req, '403-FORBIDDEN', `Invalid Token: ${err.message}`);
        res.clearCookie('token');
        return res.status(403).json({ error: 'Invalid or expired session.' });
    }
};