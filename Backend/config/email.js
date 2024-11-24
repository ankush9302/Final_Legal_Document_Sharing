require('dotenv').config();
const nodemailer = require('nodemailer');
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const Message = require('../models/Message');

// const transporter = nodemailer.createTransport({
//   service: 'gmail', // Can be replaced with any email service (like SendGrid, Mailgun, Amazon SES)
//   auth: {
//       user: process.env.SENDER_EMAIL_ID,  // Your email
//       pass: process.env.SENDER_EMAIL_PASSWORD,  // Your email password or app-specific password
//   },
// });

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY
});

// Function to send emails
const sendEmail = async (toEmail, subject, textBody, htmlBody, clientId) => {
  try {
    const messageData = {
      from: `Legal Doc Sharing <noreply@${process.env.MAILGUN_DOMAIN}>`,
      to: toEmail,
      subject: subject,
      text: textBody,
      html: htmlBody,
      'o:tracking': 'yes',
      'o:tracking-clicks': 'yes',
      'o:tracking-opens': 'yes',
      'v:client-id': clientId,
      'h:X-Mailgun-Variables': JSON.stringify({ clientId })
    };

    const response = await mg.messages.create(process.env.MAILGUN_DOMAIN, messageData);

    // Update message status in database
    await Message.findOneAndUpdate(
      { clientId },
      {
        $set: {
          'email.mailgunId': response.id,
          'email.status': 'sent',
          'email.sentAt': new Date()
        }
      },
      { upsert: true }
    );

    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = { sendEmail };