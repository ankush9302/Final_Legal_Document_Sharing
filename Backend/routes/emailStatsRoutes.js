const express = require('express');
const router = express.Router();
const emailStatsController = require('../controllers/emailStatsController');

router.get('/', emailStatsController.getEmailStats);

module.exports = router;