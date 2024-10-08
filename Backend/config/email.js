const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // Can be replaced with any email service (like SendGrid, Mailgun, Amazon SES)
  auth: {
    user: process.env.SENDER_EMAIL_ID,  // Your email
      pass: process.env.SENDER_EMAIL_PASSWORD,  // Your email password or app-specific password
  },
});

// Function to send emails
const sendEmail = async (toEmail, subject, textBody, htmlBody) => {
  const mailOptions = {
    from: process.env.SENDER_EMAIL_ID,  // Sender address from env variable
    to: toEmail,                        // Recipient's email address
    subject: subject,                   // Email subject
    text: textBody,                     // Plaintext body (optional)
    html: htmlBody,                     // HTML body (optional)
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
  } catch (error) {
    console.error(`Error sending email: ${error}`);
  }
};

module.exports = { sendEmail };