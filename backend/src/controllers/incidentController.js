let incidents = [
    { id: 1, title: 'Проблема с сетью', priority: 'Высокий', status: 'Открыт' }
];

exports.getAllIncidents = (req, res) => {
    res.json(incidents);
};

exports.createIncident = (req, res) => {
    const { title, priority } = req.body;
    const newIncident = {
        id: Date.now(), // Используем время для уникального ID
        title,
        priority,
        status: 'Открыт'
    };
    incidents.push(newIncident);
    res.status(201).json(newIncident);
};

exports.deleteIncident = (req, res) => {
    const { id } = req.params;
    incidents = incidents.filter(inc => inc.id !== parseInt(id));
    res.json({ message: 'Инцидент удален' });
};

exports.updateStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const incident = incidents.find(inc => inc.id === parseInt(id));
    if (incident) {
        incident.status = status;
        res.json(incident);
    } else {
        res.status(404).json({ message: 'Инцидент не найден' });
    }
};