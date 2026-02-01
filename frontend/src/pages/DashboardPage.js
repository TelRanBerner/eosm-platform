import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import './DashboardPage.css';

const DashboardPage = () => {
    const [incidents, setIncidents] = useState([]);
    const [newTitle, setNewTitle] = useState('');

    // Filtering states
    const [filterText, setFilterText] = useState('');
    const [filterPriority, setFilterPriority] = useState('All');

    const fetchIncidents = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/incidents');
            const data = await response.json();
            setIncidents(data);
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    useEffect(() => { fetchIncidents(); }, []);

    const onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId) return;
        await updateStatus(draggableId, destination.droppableId);
    };

    const updateStatus = async (id, status) => {
        await fetch(`http://localhost:5000/api/incidents/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        fetchIncidents();
    };

    const handleCreateIncident = async (e) => {
        e.preventDefault();
        if (!newTitle) return;
        await fetch('http://localhost:5000/api/incidents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newTitle, priority: 'Medium' }) // Default priority
        });
        setNewTitle('');
        fetchIncidents();
    };

    const deleteIncident = async (id) => {
        await fetch(`http://localhost:5000/api/incidents/${id}`, { method: 'DELETE' });
        fetchIncidents();
    };

    // English Column Names
    const columns = ['Open', 'In Progress', 'Resolved'];

    // Filtering Logic
    const filteredIncidents = incidents.filter(inc => {
        const matchesText = inc.title.toLowerCase().includes(filterText.toLowerCase());
        const matchesPriority = filterPriority === 'All' || inc.priority === filterPriority;
        return matchesText && matchesPriority;
    });

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-title">🛰 EOSM Kanban Board</h2>

            <div className="controls-section">
                {/* Create Form */}
                <form onSubmit={handleCreateIncident} className="quick-add-form">
                    <input
                        type="text" placeholder="+ Add new task"
                        value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
                    />
                    <button type="submit">Create</button>
                </form>

                {/* Filter Panel */}
                <div className="filter-panel">
                    <input
                        type="text"
                        placeholder="🔍 Search by title..."
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

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="kanban-board">
                    {columns.map(columnId => (
                        <div className="kanban-column" key={columnId}>
                            <h3>{columnId}</h3>
                            <Droppable droppableId={columnId}>
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="card-list">
                                        {filteredIncidents
                                            .filter(inc => inc.status === columnId)
                                            .map((inc, index) => (
                                                <Draggable key={inc.id.toString()} draggableId={inc.id.toString()} index={index}>
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className="incident-card"
                                                        >
                                                            <div className="card-header">
                                                                <span className="card-id">#{inc.id}</span>
                                                                <button className="delete-btn" onClick={() => deleteIncident(inc.id)}>×</button>
                                                            </div>
                                                            <p>{inc.title}</p>
                                                            <div className={`priority-tag ${inc.priority}`}>{inc.priority}</div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
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