let incidents = [
    { id: 1, title: 'Network connectivity issue', priority: 'High', status: 'Open' }
];

exports.getAllIncidents = (req, res) => {
    res.json(incidents);
};

exports.createIncident = (req, res) => {
    const { title, priority } = req.body;
    const newIncident = {
        id: Date.now(), // Unique ID based on timestamp
        title,
        priority: priority || 'Medium',
        status: 'Open'
    };
    incidents.push(newIncident);
    res.status(201).json(newIncident);
};

exports.deleteIncident = (req, res) => {
    const { id } = req.params;
    // Используем String() для надежности
    incidents = incidents.filter(inc => String(inc.id) !== String(id));
    res.json({ message: 'Incident deleted successfully' });
};

exports.updateStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    console.log("--- ПОПЫТКА ОБНОВЛЕНИЯ ---");
    console.log("Ищем ID:", id, "(тип:", typeof id, ")");
    console.log("Новый статус:", status);
    console.log("Доступные ID в базе:", incidents.map(i => i.id));

    // Поиск с принудительным приведением к строке
    const incident = incidents.find(inc => String(inc.id) === String(id));

    if (incident) {
        incident.status = status;
        console.log("✅ УСПЕХ: Статус изменен");
        res.json(incident);
    } else {
        console.log("❌ ОШИБКА: Задача не найдена");
        res.status(404).json({ error: 'Incident not found' });
    }
    console.log("--------------------------");
};