require('dotenv').config();
console.log("Twilio SID:", process.env.TWILIO_ACCOUNT_SID);
console.log("Twilio Token:", process.env.TWILIO_AUTH_TOKEN);

const twilio = require('twilio');

// Configure Twilio
const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

module.exports = client;
