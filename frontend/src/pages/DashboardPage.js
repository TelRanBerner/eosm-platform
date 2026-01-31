import React, { useState } from 'react';

const DashboardPage = () => {
    // Состояние для списка инцидентов
    const [incidents, setIncidents] = useState([
        { id: 'INC-101', title: 'Не работает Wi-Fi в ауд. 302', status: 'В работе', priority: 'Высокий' },
        { id: 'INC-102', title: 'Ошибка принтера (2 этаж)', status: 'Открыт', priority: 'Средний' },
    ]);

    // Состояние для полей новой заявки
    const [newTitle, setNewTitle] = useState('');
    const [newPriority, setNewPriority] = useState('Средний');

    const handleCreateIncident = (e) => {
        e.preventDefault();
        if (!newTitle) return;

        const newIncident = {
            id: `INC-${Math.floor(Math.random() * 1000)}`,
            title: newTitle,
            status: 'Открыт',
            priority: newPriority
        };

        setIncidents([newIncident, ...incidents]); // Добавляем в начало списка
        setNewTitle(''); // Очищаем поле
        alert('Заявка успешно создана (локально)!');
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2>Панель управления (Dashboard)</h2>

            {/* ФОРМА СОЗДАНИЯ ЗАЯВКИ */}
            <div style={{
                backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px',
                marginBottom: '30px', border: '1px solid #ddd'
            }}>
                <h3>🆕 Создать новую заявку</h3>
                <form onSubmit={handleCreateIncident} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                    <div style={{ flex: 2 }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Что случилось?</label>
                        <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="Напр: Проблема с доступом в почту"
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Приоритет</label>
                        <select
                            value={newPriority}
                            onChange={(e) => setNewPriority(e.target.value)}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        >
                            <option value="Низкий">Низкий</option>
                            <option value="Средний">Средний</option>
                            <option value="Высокий">Высокий</option>
                        </select>
                    </div>
                    <button type="submit" style={{
                        padding: '10px 20px', backgroundColor: '#27ae60', color: 'white',
                        border: 'none', borderRadius: '4px', cursor: 'pointer'
                    }}>
                        Создать
                    </button>
                </form>
            </div>

            {/* ТАБЛИЦА ИНЦИДЕНТОВ */}
            <h3>📋 Список инцидентов</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead>
                <tr style={{ backgroundColor: '#f4f4f4', textAlign: 'left' }}>
                    <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>ID</th>
                    <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Описание</th>
                    <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Статус</th>
                    <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Приоритет</th>
                </tr>
                </thead>
                <tbody>
                {incidents.map(inc => (
                    <tr key={inc.id}>
                        <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{inc.id}</td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{inc.title}</td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                                <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: '#e8f4fd', fontSize: '12px' }}>
                                    {inc.status}
                                </span>
                        </td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{inc.priority}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default DashboardPage;