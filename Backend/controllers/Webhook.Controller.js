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
    console.log("WhatsApp Webhook received:", JSON.stringify(req.body, null, 2));

    const entry = req.body.entry?.[0];
    if (!entry || !entry.changes) {
      return res.status(400).json({ error: "Invalid webhook payload" });
    }

    const change = entry.changes[0];
    const messageId = change.value?.statuses?.[0]?.id;
    const status = change.value?.statuses?.[0]?.status;

    if (!messageId || !status) {
      return res.status(400).json({ error: "Missing message ID or status" });
    }

    let newStatus = null;
    if (status === "sent") newStatus = "Sent";
    else if (status === "delivered") newStatus = "Delivered";
    else if (status === "read") newStatus = "Read";
    else if (status === "failed") newStatus = "Failed";

    if (!newStatus) return res.status(200).json({ message: "Event ignored" });

    let existingMessage = await WhatsappMessage.findOne({ messageId });

    if (existingMessage) {
      const existingStatus = existingMessage.status;

      if (STATUS_PRIORITY_WHATSAPP[newStatus] > STATUS_PRIORITY_WHATSAPP[existingStatus]) {
        existingMessage.status = newStatus;
        await existingMessage.save();
        console.log(`Updated WhatsApp message ${messageId} from ${existingStatus} -> ${newStatus}`);
      } else {
        console.log(`Ignored status update: ${existingStatus} -> ${newStatus}`);
      }
    } else {
      console.log(`No entry found for messageId: ${messageId}`);
      return res.status(404).json({ message: "WhatsApp message not found in the database" });
    }

    res.status(200).json({ message: "WhatsApp message status updated", existingMessage });
  } catch (error) {
    console.error(`WhatsApp Webhook error: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

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
