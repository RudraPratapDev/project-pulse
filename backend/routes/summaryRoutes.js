const express = require('express');
const router = express.Router();
const { getDailySummary } = require('../controllers/summaryController');
const apiKeyMiddleware = require('../middleware/apiKeyMiddleware');

// Protected by API key for Lambda access
router.get('/daily', apiKeyMiddleware, getDailySummary);

module.exports = router;
