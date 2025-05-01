require('dotenv').config();
const formData = require('form-data');
const Mailgun = require('mailgun.js');

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
    username:'api',
    key: process.env.MAILGUN_API_KEY, // Use API Key instead of SMTP credentials
});

const sendEmail = async (toEmail, subject, textBody, htmlBody) => {
    try {
        const info = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
            from: process.env.SENDER_EMAIL_ID,
            to: toEmail,
            subject: subject,
            text: textBody,
            html: htmlBody,
            'o:tracking-opens': 'true', // Enable open tracking
             'o:tracking-clicks': 'true'//enable click tracking for links in email
        });

        console.log(`Email sent: ${info.id}`);
        return { status: 'sent', id: info.id };
    } catch (error) {
        console.error(`Error sending email: ${error.message}`);
        return { status: 'failed', error: error.message };
    }
};

module.exports = { sendEmail };



//problem--- send 100s msg
//