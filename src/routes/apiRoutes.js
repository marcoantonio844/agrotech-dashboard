// src/routes/apiRoutes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Define os caminhos
router.get('/dashboard', dashboardController.getFarmSummary);
router.get('/sensores', dashboardController.getSensorReadings);

module.exports = router;