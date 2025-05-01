const axios = require("axios");
const { ACCESS_TOKEN, PHONE_NUMBER_ID, API_URL } = require("../config/whatsapp");
const twilioClient = require('../config/twilio');

/**
 * Sends a WhatsApp message via Meta API.
 * @param {string} phoneNumber - Recipient's phone number (with country code).
 * @param {string} messageBody - Message content to be sent.
 * @returns {Promise<object>} - API response data.
 */
const sendWhatsAppMessage = async (phoneNumber, messageBody) => {
  try {
    const response = await axios.post(
      `${API_URL}${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: `+91${phoneNumber}`,
        type: "text",
        text: { body: messageBody },
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("WhatsApp API Error:", error.response?.data || error);
    throw new Error("Failed to send WhatsApp message");
  }
};

/**
 * Sends a WhatsApp message via Twilio.
 * @param {string} phoneNumber - Recipient's phone number (with country code).
 * @param {string} messageBody - Message content to be sent.
 * @returns {Promise<object>} - API response data.
 */
const sendWhatsAppMessageTwilio = async (phoneNumber, messageBody) => {
  try {
      // Send WhatsApp
      const twilioResponse = await twilioClient.messages.create({
        body: messageBody,
        from: 'whatsapp:+14155238886',
        to: `whatsapp:+91${phoneNumber}`
      })

      return twilioResponse;
  } catch (error) {
    console.error("WhatsApp API Error:", error.response?.data || error);
    throw new Error("Failed to send WhatsApp message");
  }
};

module.exports = { sendWhatsAppMessage , sendWhatsAppMessageTwilio };
