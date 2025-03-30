require('dotenv').config();

module.exports = {
  ACCESS_TOKEN: process.env.WHATSAPP_ACCESS_TOKEN,  // Meta API Access Token
  PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID, // Meta Business Phone Number ID
  API_URL: "https://graph.facebook.com/v17.0/", // Base URL for WhatsApp API
};
