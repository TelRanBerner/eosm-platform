// Пока у нас нет БД, это просто структура объекта,
// которую мы будем использовать в будущем с MongoDB
const incidentSchema = {
    title: String,
    priority: ['Низкий', 'Средний', 'Высокий'],
    status: ['Открыт', 'В работе', 'Решено', 'Закрыто'],
    createdAt: Date,
    createdBy: String // Здесь будет ID пользователя
};