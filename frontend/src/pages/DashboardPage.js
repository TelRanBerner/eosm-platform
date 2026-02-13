import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import './DashboardPage.css';

const DashboardPage = ({ user }) => {
    const [incidents, setIncidents] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [filterText, setFilterText] = useState('');
    const [filterPriority, setFilterPriority] = useState('All');

    const fetchIncidents = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/incidents', { // УБРАЛИ /my
                credentials: 'include'
            });

            if (!response.ok) {
                console.error("Ошибка сервера:", response.status);
                return;
            }

            const data = await response.json();
            setIncidents(data);
        } catch (error) {
            console.error("Ошибка запроса:", error);
        }
    };

    useEffect(() => {
        fetchIncidents();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await fetch(`http://localhost:5000/api/incidents/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
                credentials: 'include'
            });
            fetchIncidents();
        } catch (err) { console.error("Update error:", err); }
    };

    const handleCreateIncident = async (e) => {
        e.preventDefault();
        if (!newTitle) return;
        try {
            const response = await fetch('http://localhost:5000/api/incidents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newTitle, priority: 'Medium' }),
                credentials: 'include'
            });
            if (response.ok) {
                setNewTitle('');
                fetchIncidents();
            }
        } catch (err) { console.error("Create error:", err); }
    };

    const deleteIncident = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/incidents/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            fetchIncidents();
        } catch (err) { console.error("Delete error:", err); }
    };

    const columns = ['Open', 'In Progress', 'Resolved'];

    const filteredIncidents = Array.isArray(incidents)
        ? incidents.filter(inc => {
            const titleMatch = inc.title?.toLowerCase().includes(filterText.toLowerCase());
            const priorityMatch = filterPriority === 'All' || inc.priority === filterPriority;
            return titleMatch && priorityMatch;
        })
        : [];

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h2 className="dashboard-title">🛰 EOSM COMMAND CENTER</h2>
                <div className="status-badge">Role: {user?.role?.toUpperCase()} | {user?.name}</div>
            </header>

            <div className="controls-section">
                {(user?.role === 'admin' || user?.role === 'support') && (
                    <form onSubmit={handleCreateIncident} className="quick-add-form">
                        <input
                            type="text"
                            placeholder="+ Initialize new mission task..."
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
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
                        onChange={(e) => setFilterText(e.target.value)}
                    />
                    <select
                        className="filter-select"
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value)}
                    >
                        <option value="All">All Priorities</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>
            </div>

            <DragDropContext onDragEnd={(res) => {
                const { destination, draggableId } = res;
                if (!destination) return;
                updateStatus(draggableId, destination.droppableId);
            }}>
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
                                                const currentId = (inc._id || inc.id).toString();
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

                                                                {/* Support actions logic */}
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