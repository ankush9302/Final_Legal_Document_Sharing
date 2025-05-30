require('dotenv').config();
const twilio = require('twilio');

// Configure Twilio
const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

module.exports = client;
