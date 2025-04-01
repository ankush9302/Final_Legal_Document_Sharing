const EmailMessage = require("../models/EmailMessage");
const WhatsappMessage = require("../models/WhatsappMessage");

const STATUS_PRIORITY_EMAIL = {
  sent: -1,
  failed: 0,
  delivered: 1,
  opened: 2,
  clicked: 3, // Highest priority
};

const STATUS_PRIORITY_WHATSAPP = {
  Sent: 0,
  Delivered: 1,
  Read: 2, // Highest priority
  Failed: -1,
};

/**
 * Handles Mailgun Email Webhook
 */
const handleEmailWebhook = async (req, res) => {
  try {
    console.log("Email Webhook received:", JSON.stringify(req.body, null, 2));

    const eventData = req.body["event-data"];
    if (!eventData) {
      return res.status(400).json({ error: "Invalid webhook payload" });
    }

    const { event, message } = eventData;
    if (!message || !message.headers || !message.headers["message-id"]) {
      return res.status(400).json({ error: "Invalid message structure", body: req.body });
    }

    const messageId = message.headers["message-id"];
    let newStatus = null;

    if (event === "delivered") newStatus = "delivered";
    else if (event === "opened") newStatus = "opened";
    else if (event === "clicked") newStatus = "clicked";
    else if (event === "failed") newStatus = "failed";

    if (!newStatus) return res.status(200).json({ message: "Event ignored" });

    let existingEmail = await EmailMessage.findOne({ messageId });

    if (existingEmail) {
      const existingStatus = existingEmail.status;

      if (STATUS_PRIORITY_EMAIL[newStatus] > STATUS_PRIORITY_EMAIL[existingStatus]) {
        existingEmail.status = newStatus;
        await existingEmail.save();
        console.log(`Updated email status of ${messageId} from ${existingStatus} -> ${newStatus}`);
      } else {
        console.log(`Ignored status update: ${existingStatus} -> ${newStatus}`);
      }
    } else {
      console.log(`No Entry Found for messageId: ${messageId}`);
      return res.status(404).json({ message: "Email not found in the database" });
    }

    res.status(200).json({ message: "Email status updated", existingEmail });
  } catch (error) {
    console.error(`Email Webhook error: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Handles WhatsApp Webhook
 */
const handleWhatsappWebhook = async (req, res) => {
  try {
    // ===== 1. Handle GET (Meta verification challenge) =====
    if (req.method === "GET") {
      const mode = req.query["hub.mode"];
      const token = req.query["hub.verify_token"];
      const challenge = req.query["hub.challenge"];
    
      if (mode && token) {
        if (mode === "subscribe" && token === VERIFY_TOKEN) {
          console.log("✅ Webhook Verified Successfully");
          return res.status(200).send(challenge); // Meta expects this challenge response
        } else {
          console.error("❌ Verification failed. Invalid token.");
          return res.sendStatus(403); // Forbidden
        }
      }
    }

    // ===== 2. Handle POST (Webhook events) =====
    console.log("📩 Webhook Event:", JSON.stringify(req.body, null, 2));

    // Validate payload structure
    const entry = req.body.entry?.[0];
    if (!entry?.changes) {
      return res.status(400).json({ error: "Invalid payload structure" });
    }

    // Process message status updates
    const statusData = entry.changes[0].value?.statuses?.[0];
    if (!statusData?.id || !statusData?.status) {
      return res.status(200).send("OK"); // Acknowledge but ignore
    }

    const { id: messageId, status, errors } = statusData;

    // Log failed messages
    if (status === "failed") {
      console.error("❌ Message failed:", { messageId, error: errors?.[0] });
    }

    // Update database (example using Mongoose)
    const existingMessage = await WhatsappMessage.findOne({ messageId });
    if (existingMessage) {
      existingMessage.status = status;
      await existingMessage.save();
      console.log(`🔄 Updated message ${messageId}: ${status}`);
    }

    return res.status(200).send("OK"); // Always acknowledge

  } catch (error) {
    console.error("🔥 Webhook error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { handleWhatsappWebhook };

const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN || "my_secure_token"; // Store in .env

/**
 * Meta Webhook Verification Handler
 */
const verifyWebhook = (req, res) => {
    console.log("recieved req for verifying meta token",req)
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("✅ Webhook Verified Successfully");
      return res.status(200).send(challenge); // Meta expects this challenge response
    } else {
      console.error("❌ Verification failed. Invalid token.");
      return res.sendStatus(403); // Forbidden
    }
  }
  return res.sendStatus(400); // Bad request
};




module.exports = {
  handleEmailWebhook,
  handleWhatsappWebhook,
  verifyWebhook
};
