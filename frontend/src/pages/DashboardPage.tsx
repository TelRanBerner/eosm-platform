import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import api from '../api'; // Используем наш настроенный axios
import { IUser } from '../types';
import './styles/DashboardPage.css';

// 1. Описываем интерфейс инцидента
interface IIncident {
    _id: string;
    id?: string; // на случай если бэкенд шлет id вместо _id
    title: string;
    status: 'Open' | 'In Progress' | 'Resolved';
    priority: 'High' | 'Medium' | 'Low';
}

interface DashboardProps {
    user: IUser | null;
}

const DashboardPage: React.FC<DashboardProps> = ({ user }) => {
    // 2. Типизируем стейты
    const [incidents, setIncidents] = useState<IIncident[]>([]);
    const [newTitle, setNewTitle] = useState<string>('');
    const [filterText, setFilterText] = useState<string>('');
    const [filterPriority, setFilterPriority] = useState<string>('All');

    const fetchIncidents = async () => {
        try {
            // Используем api (axios) вместо fetch для краткости и токенов
            const { data } = await api.get<IIncident[]>('/incidents');
            setIncidents(data);
        } catch (error) {
            console.error("Ошибка запроса:", error);
        }
    };

    useEffect(() => {
        fetchIncidents();
    }, []);

    const updateStatus = async (id: string, status: string) => {
        try {
            await api.patch(`/incidents/${id}`, { status });
            fetchIncidents();
        } catch (err) { console.error("Update error:", err); }
    };

    const handleCreateIncident = async (e: FormEvent) => {
        e.preventDefault();
        if (!newTitle) return;
        try {
            await api.post('/incidents', { title: newTitle, priority: 'Medium' });
            setNewTitle('');
            fetchIncidents();
        } catch (err) { console.error("Create error:", err); }
    };

    const deleteIncident = async (id: string) => {
        try {
            await api.delete(`/incidents/${id}`);
            fetchIncidents();
        } catch (err) { console.error("Delete error:", err); }
    };

    const columns: Array<IIncident['status']> = ['Open', 'In Progress', 'Resolved'];

    const filteredIncidents = Array.isArray(incidents)
        ? incidents.filter(inc => {
            const titleMatch = inc.title?.toLowerCase().includes(filterText.toLowerCase());
            const priorityMatch = filterPriority === 'All' || inc.priority === filterPriority;
            return titleMatch && priorityMatch;
        })
        : [];

    // Типизируем функцию завершения перетаскивания
    const onDragEnd = (res: DropResult) => {
        const { destination, draggableId } = res;
        if (!destination) return;
        updateStatus(draggableId, destination.droppableId);
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h2 className="dashboard-title">🛰 EOSM COMMAND CENTER</h2>
                <div className="status-badge">
                    Role: {user?.role?.toUpperCase()} | {user?.name}
                </div>
            </header>

            <div className="controls-section">
                {(user?.role === 'admin' || user?.role === 'support') && (
                    <form onSubmit={handleCreateIncident} className="quick-add-form">
                        <input
                            type="text"
                            placeholder="+ Initialize new mission task..."
                            value={newTitle}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTitle(e.target.value)}
                        />
                        <button type="submit">Deploy</button>
                    </form>
                )}

                <div className="filter-panel">
                    <input
                        type="text"
                        placeholder="🔍 Search tickets..."
                        className="filter-input"
                        value={filterText}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setFilterText(e.target.value)}
                    />
                    <select
                        className="filter-select"
                        value={filterPriority}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterPriority(e.target.value)}
                    >
                        <option value="All">All Priorities</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="kanban-board">
                    {columns.map(columnId => (
                        <div className="kanban-column" key={columnId}>
                            <div className="column-header">
                                <h3>{columnId}</h3>
                                <span className="count">
                                    {filteredIncidents.filter(inc => inc.status === columnId).length}
                                </span>
                            </div>
                            <Droppable droppableId={columnId}>
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="card-list">
                                        {filteredIncidents
                                            .filter(inc => inc.status === columnId)
                                            .map((inc, index) => {
                                                const currentId = (inc._id || inc.id || '').toString();
                                                return (
                                                    <Draggable key={currentId} draggableId={currentId} index={index}>
                                                        {(provided) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className="incident-card"
                                                            >
                                                                <div className="card-header">
                                                                    <span className="card-id">#{currentId.slice(-4)}</span>
                                                                    {user?.role === 'admin' && (
                                                                        <button className="delete-btn" onClick={() => deleteIncident(currentId)}>×</button>
                                                                    )}
                                                                </div>
                                                                <p className="card-title">{inc.title}</p>

                                                                {user?.role === 'support' && inc.status === 'Open' && (
                                                                    <div className="support-actions">
                                                                        <button className="action-btn accept" onClick={() => updateStatus(currentId, 'In Progress')}>Accept</button>
                                                                    </div>
                                                                )}

                                                                <div className={`priority-tag ${inc.priority}`}>{inc.priority}</div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                );
                                            })}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
};

export default DashboardPage;