const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/:batchId/getreport', reportController.getReport);
// router.get('/report/stats', reportController.getStats);

module.exports = router;