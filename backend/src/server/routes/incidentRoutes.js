import express from 'express';
import { IncidentModel } from '../models/Incident.js'; // Убедись, что путь к модели верный

const router = express.Router();

// 1. Получить все инциденты
router.get('/', async (req, res) => {
    try {
        const incidents = await IncidentModel.find();
        res.json(incidents);
    } catch (err) {
        res.status(500).json({ message: 'Не удалось получить список аномалий' });
    }
});

// 2. Создать новый инцидент
router.post('/', async (req, res) => {
    try {
        const doc = new IncidentModel({
            title: req.body.title,
            priority: req.body.priority,
            status: req.body.status,
            user: req.userId, // Мы берем ID из токена (благодаря checkAuth)
        });

        const incident = await doc.save();
        res.json(incident);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка при передаче данных в EOSM' });
    }
});

// 3. Обновить статус (например, PROCESS или RESOLVE)
// Обновление заголовка тикета
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;

        // Находим инцидент и обновляем его
        const updatedIncident = await Incident.findByIdAndUpdate(
            id,
            { title },
            { new: true } // Вернуть обновленный объект
        );

        res.json(updatedIncident);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// 4. Удалить инцидент
router.delete('/:id', async (req, res) => {
    try {
        const incidentId = req.params.id;
        const result = await IncidentModel.findByIdAndDelete(incidentId);

        if (!result) {
            return res.status(404).json({ message: 'Лог не найден' });
        }

        res.json({ success: true, message: 'Данные удалены из системы' });
    } catch (err) {
        res.status(500).json({ message: 'Ошибка при очистке логов' });
    }
});

export default router; // Экспортируем роутер для использования в app.js