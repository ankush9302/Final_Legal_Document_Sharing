const express = require('express');
const router = express.Router();
const emailStatusController = require('../controllers/emailStatusController');

router.get('/status', emailStatusController.getEmailStatus);
router.get('/failed', emailStatusController.getFailedEmails);
router.get('/success', emailStatusController.getSuccessfulEmails);
router.get('/opened', emailStatusController.getOpenedEmails);

module.exports = router; 