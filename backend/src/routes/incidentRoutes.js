const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController');

router.get('/', incidentController.getAllIncidents);
router.post('/', incidentController.createIncident);
router.delete('/:id', incidentController.deleteIncident);
router.patch('/:id', incidentController.updateStatus);

module.exports = router;