const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

// Определение эндпоинта /health
router.get('/', healthController.getHealthStatus);

module.exports = router;