const express = require('express');
const router = express.Router();
const mailgunWebhookController = require('../controllers/mailgunWebhookController');

router.post('/webhook', mailgunWebhookController.handleWebhook);

module.exports = router;