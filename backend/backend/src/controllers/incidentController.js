const Incident = require('../server/models/Incident.js'); // Проверь регистр! (Incident с большой буквы) // Предполагаем, что модель создана

// ПОЛУЧЕНИЕ ТИКЕТОВ (с учетом ролей)
// ПОЛУЧЕНИЕ ТИКЕТОВ (с автоматической сортировкой от новых к старым)
exports.getIncidents = async (req, res) => {
    try {
        let query = {};

        // 1. Фильтрация по ролям: пользователи видят только свои логи
        if (req.user.role !== 'admin' && req.user.role !== 'support') {
            // Используем ID из токена для фильтрации
            query = { creatorId: req.user.id || req.user.email };
        }

        // 2. Поиск с сортировкой: -1 — это "от свежих к старым"
        const incidents = await Incident.find(query).sort({ createdAt: -1 });

        res.json(incidents);
    } catch (err) {
        console.error('Ошибка получения логов:', err.message);
        res.status(500).json({ error: "Ошибка при получении данных с EOSM" });
    }
};

// СОЗДАНИЕ ТИКЕТА

exports.createIncident = async (req, res) => {
    try {
        // 1. Логируем для проверки (увидишь в терминале WebStorm)
        console.log('Данные пользователя из токена:', req.user);

        // 2. Проверяем, что middleware передал нам пользователя
        if (!req.user) {
            return res.status(401).json({ error: "Пользователь не распознан. Войдите в систему заново." });
        }

        // 3. Создаем новый объект инцидента
        const newIncident = new Incident({
            title: req.body.title,
            priority: req.body.priority || 'Low',
            status: 'Open',
            // Если req.user.id пустой, берем email или имя как заглушку
            creatorId: req.user.id || req.user.email || 'anonymous'
        });

        // 4. Сохраняем в MongoDB Atlas
        const savedIncident = await newIncident.save();

        res.status(201).json(savedIncident);
    } catch (err) {
        // Если creatorId всё еще пустой, Mongoose выдаст ту самую ошибку 400
        console.error('Ошибка сохранения:', err.message);
        res.status(400).json({ error: err.message });
    }
};

// ОБНОВЛЕНИЕ СТАТУСА (Действие для Support/Engineer)
exports.updateIncidentStatus = async (req, res) => {
    try {
        const { status, assignedTo } = req.body;

        // Проверка прав: только персонал может менять статус
        if (req.user.role === 'user') {
            return res.status(403).json({ error: 'Operators cannot modify mission status' });
        }

        const incident = await Incident.findByIdAndUpdate(
            req.params.id,
            { status, assignedTo },
            { new: true }
        );

        res.json(incident);
    } catch (err) {
        res.status(400).json({ error: 'Update failed' });
    }
};

// ОБНОВЛЕНИЕ СТАТУСА (Действие для Support/Admin)
exports.updateIncidentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Проверка прав: только персонал может менять статус (Пункт 8 плана - RBAC)
        if (req.user.role === 'user' || req.user.role === 'operator') {
            return res.status(403).json({ error: 'Operators cannot modify mission status' });
        }

        const updatedIncident = await Incident.findByIdAndUpdate(
            id,
            { status: status },
            { new: true }
        );

        if (!updatedIncident) {
            return res.status(404).json({ error: "Тикет не найден" });
        }

        res.json(updatedIncident);
    } catch (err) {
        console.error('Ошибка обновления статуса:', err.message);
        res.status(400).json({ error: err.message });
    }
};