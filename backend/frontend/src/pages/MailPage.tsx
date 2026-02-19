import React, { useState } from 'react';
import './styles/UserTicketsPage.css'; // Используем те же стили для экономии времени

const MailPage = () => {
    const [selectedMail, setSelectedMail] = useState<any>(null);

    const messages = [
        { id: 1, date: '2026-02-18', sender: 'Support', subject: 'System Update', body: 'Welcome to EOSM. Your terminal is now active.' },
        { id: 2, date: '2026-02-17', sender: 'Command', subject: 'Mission Details', body: 'Proceed to Sector 7 for further instructions.' }
    ];

    return (
        <div className="terminal-container">
        <h2 className="dashboard-title">📧 INCOMING MESSAGES</h2>
    <div className="glass-panel" style={{ padding: '20px' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', color: '#00ff88' }}>
    <thead>
        <tr style={{ borderBottom: '1px solid #00ff88' }}>
    <th style={{ textAlign: 'left', padding: '10px' }}>Date</th>
    <th style={{ textAlign: 'left', padding: '10px' }}>Sender</th>
    <th style={{ textAlign: 'left', padding: '10px' }}>Subject</th>
    </tr>
    </thead>
    <tbody>
    {messages.map(mail => (
            <tr key={mail.id}
        onClick={() => setSelectedMail(mail)}
    style={{ cursor: 'pointer', borderBottom: '1px solid #1a3a3a' }}
    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0, 255, 136, 0.1)'}
    onMouseOut={(e) => e.currentTarget.style.background = 'none'}>
    <td style={{ padding: '10px' }}>{mail.date}</td>
    <td style={{ padding: '10px' }}>{mail.sender}</td>
    <td style={{ padding: '10px' }}>{mail.subject}</td>
    </tr>
))}
    </tbody>
    </table>
    </div>

    {selectedMail && (
        <div className="glass-panel" style={{ marginTop: '20px', padding: '20px', border: '1px solid #00ff88' }}>
        <h3>From: {selectedMail.sender}</h3>
    <p><strong>Subject:</strong> {selectedMail.subject}</p>
    <hr style={{ borderColor: '#1a3a3a' }} />
    <p style={{ whiteSpace: 'pre-wrap' }}>{selectedMail.body}</p>
    <button className="btn-send-large" onClick={() => setSelectedMail(null)}>Close</button>
    </div>
    )}
    </div>
);
};

export default MailPage;