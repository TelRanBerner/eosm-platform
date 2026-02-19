import React, { useState, useEffect } from 'react';
import api from '../api';
import { IUser } from '../types';
import './styles/UserTicketsPage.css';

interface ITicket {
    _id: string;
    title: string;
    priority: string;
    status: string;
    createdAt: string;
    creatorId?: string;
}

const UserTicketsPage: React.FC<{ user: IUser | null }> = ({ user }) => {
    const [tickets, setTickets] = useState<ITicket[]>([]);
    const [isArchiveOpen, setIsArchiveOpen] = useState(false); // Состояние для скрытия/показа
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        message: ''
    });

    // Загрузка всех тикетов из архива
    const fetchTickets = async () => {
        try {
            const res = await api.get('/incidents');
            if (Array.isArray(res.data)) {
                // Новые логи всегда сверху
                const sorted = res.data.sort((a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setTickets(sorted);
            }
        } catch (err) {
            console.error("Ошибка загрузки архива:", err);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/incidents', {
                title: formData.message,
                priority: "Low",
                status: "Open",
                creatorId: user?.email,
                date: formData.date
            });
            setFormData({ ...formData, message: '' });
            fetchTickets();
            alert("Mission report created!");
        } catch (err) {
            alert("Ошибка при отправке отчета");
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Удалить этот лог из базы данных?")) {
            try {
                await api.delete(`/incidents/${id}`);
                setTickets(prev => prev.filter(t => t._id !== id));
            } catch (err) {
                alert("Ошибка при удалении тикета");
            }
        }
    };

    return (
        <div className="terminal-container" style={{ overflowY: 'auto', maxHeight: '100vh', paddingBottom: '50px' }}>
            <div className="status-indicator">
                <span className="green-dot"></span>
                SYSTEM ONLINE | OPERATOR: {user?.name || 'UNKNOWN'}
            </div>

            {/* ФОРМА СОЗДАНИЯ */}
            <div className="central-dispatch">
                <form className="glass-panel main-form" onSubmit={handleSubmit}>
                    <h2 className="dashboard-title">CREATE YOUR TICKET</h2>
                    <div className="input-group">
                        <label>Operator Name</label>
                        <input type="text" value={user?.name || ''} readOnly style={{ opacity: 0.7 }} />
                    </div>
                    <div className="input-group">
                        <label>Date of Incident</label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Detailed Message</label>
                        <textarea
                            rows={4}
                            value={formData.message}
                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                            placeholder="Enter coordinates or incident details..."
                            required
                        />
                    </div>
                    <button type="submit" className="btn-send-large">🚀 SUBMIT TO COMMAND</button>
                </form>
            </div>

            {/* КНОПКА УПРАВЛЕНИЯ АРХИВОМ */}
            <div style={{ textAlign: 'center', margin: '30px 0', width: '100%' }}>
                <button
                    onClick={() => setIsArchiveOpen(!isArchiveOpen)}
                    className="btn-send-large"
                    style={{
                        background: 'transparent',
                        border: `1px solid ${isArchiveOpen ? '#ff4d4d' : '#38bdf8'}`,
                        color: isArchiveOpen ? '#ff4d4d' : '#38bdf8',
                    }}
                >
                    {isArchiveOpen ? '🔼 HIDE MISSION LOGS' : `🔽 SHOW ARCHIVE (${tickets.length})`}
                </button>
            </div>

            {/* РАСКРЫВАЮЩИЙСЯ СПИСОК (АРХИВ) */}
            {isArchiveOpen && (
                <div className="archive-section">
                    <h3 className="archive-title">
                        📂 MISSION LOGS ARCHIVE ({tickets.length})
                    </h3>

                    <div className="archive-grid">
                        {tickets.length > 0 ? (
                            tickets.map((ticket) => (
                                <div className="archive-card" key={ticket._id}>
                                    <div className={`status-badge ${(ticket.status || 'open').toLowerCase()}`}>
                                        ● {ticket.status}
                                    </div>

                                    <div className="archive-message">
                                        <strong>Log:</strong> {ticket.title || "No data"}
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto' }}>
                                        <span style={{ color: '#38bdf8', fontSize: '0.8rem' }}>
                                            ID: ...{ticket._id.slice(-5).toUpperCase()}
                                        </span>
                                        <span className="archive-date">
                                            📅 {new Date(ticket.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <button
                                        className="delete-icon"
                                        onClick={() => handleDelete(ticket._id)}
                                        title="Удалить запись"
                                        style={{
                                            position: 'absolute', top: '15px', right: '15px',
                                            background: 'none', border: 'none', cursor: 'pointer'
                                        }}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="no-data">Архив пуст или синхронизируется...</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserTicketsPage;