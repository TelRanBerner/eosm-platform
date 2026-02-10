import React, { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import './UserTicketsPage.css';

const UserTicketsPage = ({ user }) => {
    const [tickets, setTickets] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchTickets = async () => {
        try {
            const response = await api.get('/incidents');
            setTickets(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Fetch error:", error.message);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const updateStatus = async (ticketId, newStatus) => {
        try {
            await api.patch(`/incidents/${ticketId}/status`, { status: newStatus });
            toast.success(`Protocol updated: ${newStatus}`);
            fetchTickets();
        } catch (error) {
            toast.error("Access Denied: Permission error");
        }
    };

    const deleteTicket = async (ticketId) => {
        if (!window.confirm("CRITICAL WARNING: Permanent deletion of anomaly log. Proceed?")) return;
        try {
            await api.delete(`/incidents/${ticketId}`);
            toast.success("Log purged from system");
            fetchTickets();
        } catch (error) {
            toast.error("Cleanup failed: Check permissions");
        }
    };

    const handleCreateTicket = async (e) => {
        e.preventDefault();
        if (!newTitle.trim()) return;
        setLoading(true);
        try {
            await api.post('/incidents', {
                title: newTitle,
                priority: 'Low',
                status: 'Open'
            });
            setNewTitle('');
            toast.success("Anomaly transmitted to EOSM");
            fetchTickets();
        } catch (err) {
            toast.error("Transmission failed");
        } finally {
            setLoading(false);
        }
    };

    const renderProgressBar = (status) => {
        let width = '20%';
        let color = '#ef4444';
        if (status === 'In Progress') { width = '60%'; color = '#f59e0b'; }
        else if (status === 'Closed' || status === 'Resolved') { width = '100%'; color = '#10b981'; }

        return (
            <div style={{ width: '100%', height: '4px', background: '#1e293b', borderRadius: '2px', margin: '10px 0', overflow: 'hidden' }}>
                <div style={{ width: width, height: '100%', backgroundColor: color, transition: 'width 0.5s ease' }} />
            </div>
        );
    };

    return (
        <div className="terminal-container">
            <header className="terminal-header" style={{ padding: '20px', textAlign: 'center' }}>
                <h2 className="dashboard-title">🛰 EOSM TERMINAL</h2>
                <div className="user-badge" style={{ fontSize: '0.8rem', opacity: 0.7 }}>Operator: {user?.email || 'Loading...'}</div>
            </header>

            {/* АДАПТИВНАЯ СЕКЦИЯ */}
            <section style={{
                width: '100%',
                maxWidth: '900px',
                margin: '0 auto',
                padding: '0 15px',
                boxSizing: 'border-box'
            }}>
                <div className="glass-panel">
                    <h3 style={{ color: '#38bdf8', marginBottom: '15px', fontSize: '0.9rem', fontWeight: 'bold' }}>[ REPORT NEW ANOMALY ]</h3>
                    <form onSubmit={handleCreateTicket} className="terminal-form" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <input
                            type="text"
                            placeholder="System anomaly description..."
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            style={{ flex: '1 1 300px', padding: '10px', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc', minWidth: '0' }}
                        />
                        <button type="submit" className="btn-work" disabled={loading} style={{ flex: '1 1 auto', cursor: 'pointer', minWidth: '120px' }}>
                            {loading ? 'SYNC...' : 'TRANSMIT'}
                        </button>
                    </form>
                </div>

                <div className="log-list" style={{ marginTop: '20px' }}>
                    {tickets.map(ticket => (
                        <div key={ticket._id} className="incident-card" style={{ background: '#0f172a', border: '1px solid #1e293b', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                                <span style={{ color: '#475569', fontSize: '0.75rem' }}>ID: {ticket._id?.slice(-6).toUpperCase()}</span>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <span className={`status-badge ${ticket.status?.toLowerCase().replace(' ', '-')}`}>
                                        {ticket.status}
                                    </span>
                                    {user?.role === 'admin' && (
                                        <button
                                            onClick={() => deleteTicket(ticket._id)}
                                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.1rem', padding: '0 5px' }}
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            </div>

                            <p className="card-title" style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#f1f5f9', margin: '10px 0 5px' }}>{ticket.title}</p>

                            {renderProgressBar(ticket.status)}

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', flexWrap: 'wrap', gap: '10px' }}>
                                <span className="priority-tag" style={{ fontSize: '0.8rem' }}>PRIORITY: {ticket.priority || 'LOW'}</span>

                                {(user?.role === 'admin' || user?.role === 'support' || user?.role === 'engineer') && (
                                    <div className="admin-actions" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        <button
                                            onClick={() => updateStatus(ticket._id, 'In Progress')}
                                            className="btn-work"
                                            disabled={ticket.status === 'In Progress' || ticket.status === 'Closed'}
                                            style={{ padding: '8px 12px', fontSize: '0.75rem' }}
                                        >
                                            PROCESS
                                        </button>
                                        <button
                                            onClick={() => updateStatus(ticket._id, 'Closed')}
                                            className="btn-close"
                                            disabled={ticket.status === 'Closed'}
                                            style={{ padding: '8px 12px', fontSize: '0.75rem' }}
                                        >
                                            RESOLVE
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default UserTicketsPage;