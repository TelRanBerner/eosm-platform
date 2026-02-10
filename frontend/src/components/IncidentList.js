import React from 'react';

const IncidentList = ({ incidents }) => {

    // Функция для определения цвета и свечения (Cyberpunk style)
    const getStatusStyles = (status) => {
        switch (status) {
            case 'Critical':
            case 'New':
                return {
                    badge: 'bg-red-900 text-red-200 border border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse',
                    bar: 'w-1/4 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]'
                };
            case 'In Progress':
                return {
                    badge: 'bg-amber-900 text-amber-200 border border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]',
                    bar: 'w-1/2 bg-amber-500'
                };
            case 'Resolved':
                return {
                    badge: 'bg-emerald-900 text-emerald-200 border border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]',
                    bar: 'w-full bg-emerald-500'
                };
            default:
                return {
                    badge: 'bg-slate-700 text-slate-300',
                    bar: 'w-5 bg-slate-500'
                };
        }
    };

    if (!incidents || incidents.length === 0) {
        return <div className="text-center text-gray-500 mt-10">Активных инцидентов не обнаружено.</div>;
    }

    return (
        <div className="grid gap-4 mt-6">
            {incidents.map((incident) => {
                const styles = getStatusStyles(incident.status);

                return (
                    <div key={incident._id} className="bg-slate-900 border border-slate-800 p-5 rounded-lg hover:border-slate-600 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-slate-100">{incident.title}</h3>
                                <p className="text-slate-400 text-sm mt-1">{incident.description}</p>
                            </div>

                            {/* СТАТУС-БАДЖ */}
                            <span className={`px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest ${styles.badge}`}>
                                {incident.status}
                            </span>
                        </div>

                        {/* СТАТУС-БАР (ЛИНИЯ ПРОГРЕССА) */}
                        <div className="mt-4">
                            <div className="flex justify-between text-[10px] text-slate-500 uppercase mb-1 font-mono">
                                <span>Progress</span>
                                <span>{incident.status === 'Resolved' ? '100%' : incident.status === 'In Progress' ? '50%' : '25%'}</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div className={`h-full transition-all duration-1000 ease-out ${styles.bar}`}></div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default IncidentList;