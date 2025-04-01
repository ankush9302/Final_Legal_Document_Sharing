const express = require("express");
const router = express.Router();
const webhookController = require("../controllers/Webhook.Controller");

// Route for handling email webhook
router.post("/mailgun", webhookController.handleEmailWebhook);

// Route for handling WhatsApp webhook
// Single route for both verification (GET) and webhooks (POST)
router.route("/whatsapp")
  .get(webhookController.handleWhatsappWebhook)  // Verification (GET)
  .post(webhookController.handleWhatsappWebhook); // Webhook events (POST)
//to verify
// router.get("/meta", webhookController.verifyWebhook);

module.exports = router;
