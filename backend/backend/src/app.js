import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Импорт валидаций и контроллеров (ES-импорты)
import { registerValidation } from './validations/auth.ts';
import checkAuth from './utils/checkAuth.js';
import * as UserController from './controllers/UserController.js';

// Импорт роутов инцидентов (убедись, что файлы имеют расширение .js)
import incidentRoutes from './server/routes/incidentRoutes.js';
import healthRoutes from './server/routes/healthRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Middleware (Логирование и безопасность)
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// 2. Подключение к БД
const mongoURI = 'mongodb+srv://testadmin:3vOzw6ye7rrDWbjp@cluster0.xlta89f.mongodb.net/eosm_platform?retryWrites=true&w=majority';

mongoose.connect(mongoURI)
    .then(() => console.log('🚀 СВЯЗЬ УСТАНОВЛЕНА: База данных в сети!'))
    .catch(err => console.error('🛰 ОШИБКА БД:', err.message));

// 3. Роуты аутентификации
app.post('/api/auth/register', registerValidation, UserController.register);
app.post('/api/auth/login', UserController.login);
app.get('/api/auth/me', checkAuth, UserController.getMe);

// 4. Роуты системы EOSM (защищаем их через checkAuth)
app.use('/health', healthRoutes);
app.use('/api/incidents', checkAuth, incidentRoutes); // Теперь инциденты доступны только по токену


// Проверка работоспособности сервера
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'online',
        timestamp: new Date().toISOString()
    });
});



// 5. Запуск
app.listen(PORT, (err) => {
    if (err) return console.log('Ошибка запуска:', err);
    console.log(`=========================================`);
    console.log(`🚀 EOSM Server started on port ${PORT}`);
    console.log(`=========================================`);
});