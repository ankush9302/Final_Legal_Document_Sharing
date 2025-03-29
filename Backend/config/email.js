require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Mailgun',
  auth: {
    user: process.env.MAILGUN_USER,  // Your Mailgun user
    pass: process.env.MAILGUN_PASSWORD,  // Your Mailgun password or API key
  },
});

// Function to send emails
const sendEmail = async (toEmail, subject, textBody, htmlBody) => {
  const mailOptions = {
    from: process.env.SENDER_EMAIL_ID,
    to: toEmail,
    subject: subject,
    text: textBody,
    html: htmlBody,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}------------------------------------------------------------`);
    console.log(info);
    console.log("---------------------------------------------------------------------------------------");
    return { status: 'sent', id: info.messageId }; // Return message ID
  } catch (error) {
    console.error(`Error sending email: ${error}`);
    return { status: 'failed', error: error.message }; // Return error
  }
};

module.exports = { sendEmail };


//problem--- send 100s msg
//