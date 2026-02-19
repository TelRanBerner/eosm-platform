require('dotenv').config(); // 1. Загружаем переменные в самом верху
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const redis = require('redis');

// Импорт роутов
const healthRoutes = require('./routes/healthRoutes');
const incidentRoutes = require('./routes/incidentRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// 2. Порт теперь берется из .env или ставится 5000 по умолчанию
const PORT = process.env.PORT || 5000;

// ==========================================
// 1. ИНИЦИАЛИЗАЦИЯ REDIS
// ==========================================
// Если хочешь, можешь и URL редиса вынести в .env: process.env.REDIS_URL
const redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
});

// ... (остальной код Redis без изменений)

// ==========================================
// 2. НАСТРОЙКА MIDDLEWARE
// ==========================================
app.use(cors({
    origin: 'http://localhost:3000', // Тут 3000 — это твой ФРОНТЕНД, это правильно
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// ==========================================
// 3. ПОДКЛЮЧЕНИЕ РОУТЕРОВ
// ==========================================
app.use('/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/incidents', incidentRoutes);

// ==========================================
// 4. ЗАПУСК СЕРВЕРА
// ==========================================
app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`📡 EOSM Backend System Initialized`);
    console.log(`🚀 Running on port: ${PORT}`); // Напишет 5000, если в .env PORT=5000
    console.log(`=========================================`);
});