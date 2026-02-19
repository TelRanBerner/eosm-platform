// Контроллер для проверки состояния сервера [cite: 18, 19]
const getHealthStatus = (req, res) => {
    res.status(200).json({
        status: "UP",
        message: "Server is running and healthy",
        timestamp: new Date().toISOString()
    });
};

module.exports = {
    getHealthStatus
};