const express = require("express");
const router = express.Router();
const webhookController = require("../controllers/Webhook.Controller");

// Route for handling email webhook
router.post("/mailgun", webhookController.handleEmailWebhook);

// Route for handling WhatsApp webhook
router.post("/whatsapp", webhookController.handleWhatsappWebhook);

module.exports = router;
