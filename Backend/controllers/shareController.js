const { sendEmail } = require('../config/email');
const twilioClient = require('../config/twilio');
const XLSX = require('xlsx');
const path = require('path');

const getClientData = (clientId) => {
  const excelPath = path.join(__dirname, '..', '..', 'public', 'Client_Data_ExcelSheet.xlsx');
  const workbook = XLSX.readFile(excelPath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const clientData = XLSX.utils.sheet_to_json(sheet);
  return clientData.find(client => client['CUSTOMER ID'] === clientId);
};

exports.shareByEmail = async (req, res) => {
  try {
    const { clientId, documentUrl } = req.body;
    const client = getClientData(clientId);
    
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    await sendEmail(
      client['BORRWER EMAIL ID'],
      'Your Document is Ready',
      'Here is your document from Legal Doc Sharing.',
      `<p>Your document is ready. <a href="${documentUrl}">Click here to view</a></p>`
    );

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
};

exports.shareByWhatsApp = async (req, res) => {
  try {
    const { clientId, documentUrl } = req.body;
    const client = getClientData(clientId);
    
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    await twilioClient.messages.create({
      body: `Your document is ready. Click here to view: ${documentUrl}`,
      from: 'whatsapp:+14155238886',
      to: `whatsapp:+91${client['BORRWER PHONE NUMBER']}`
    });

    res.status(200).json({ message: 'WhatsApp message sent successfully' });
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    res.status(500).json({ error: 'Failed to send WhatsApp message' });
  }
};

exports.shareBySMS = async (req, res) => {
  try {
    const { clientId, documentUrl } = req.body;
    const client = getClientData(clientId);
    
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    await twilioClient.messages.create({
      body: `Your document is ready. Click here to view: ${documentUrl}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${client['BORRWER PHONE NUMBER']}`
    });

    res.status(200).json({ message: 'SMS sent successfully' });
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).json({ error: 'Failed to send SMS' });
  }
};
