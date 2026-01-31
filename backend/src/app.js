const express = require('express');
const cors = require('cors');
const healthRoutes = require('./routes/healthRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const incidentRoutes = require('./routes/incidentRoutes');
// Middleware
app.use(cors()); // Позволяет фронтенду общаться с бэкендом
app.use(express.json()); // Позволяет серверу понимать JSON в запросах

// Подключение роутеров согласно архитектурной схеме
app.use('/health', healthRoutes);
app.use('/api/incidents', incidentRoutes);

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Health check available at http://localhost:${PORT}/health`);
});

