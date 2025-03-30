// console.log('ShareController loaded');
const { sendEmail } = require('../config/email');
const twilioClient = require('../config/twilio');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const MongoService = require('../models/MongoModel')
// Helper function to process template with client data


// Improved getClientData function with better error handling and logging
const getClientData = (clientId) => {
  try {
    // console.log('Searching for client:', clientId);

    // Read the Excel file
    const excelPath = path.join(__dirname, '..', 'uploads', 'updated_excel.xlsx');
    // console.log('Reading Excel file from:', excelPath);
// 
    if (!fs.existsSync(excelPath)) {
      console.error('Excel file not found at:', excelPath);
      return null;
    }

    const workbook = XLSX.readFile(excelPath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const clientData = XLSX.utils.sheet_to_json(sheet);
    const cleanedData = clientData.map((row) => {
      const cleanedRow = {};
      Object.keys(row).forEach((key) => {
    const trimmedKey = key.trim(); // Remove whitespace before and after the name
    cleanedRow[trimmedKey] = row[key]; // Assign value to cleaned key
  });
  return cleanedRow; // Return the transformed row
    });
    console.log('Cleaned data:', cleanedData[0]);
    // clientData = cleanedData;

    // console.log('Total clients in Excel:', clientData.length);
    // console.log('Client data:', clientData[0]);
    
    // Find client by ID
    const client = cleanedData.find(client => {
      console.log('Comparing:', client['CL CONTRACT ID'], clientId);
      return String(client['CL CONTRACT ID']) === String(clientId);
    });

    if (!client) {
      console.log('Client not found with ID:', clientId);
      return null;
    }

    console.log('Found client:', client);
    return client;

  } catch (error) {
    console.error('Error in getClientData:', error);
    return null;
  }
};

const processTemplate = (template, client) => {
  if (!template) return '';
  
  try {
    // Strip any HTML tags that might come from ReactQuill
    let processedTemplate = template.replace(/<[^>]*>/g, '');
    
    // Replace placeholders with client data
    const processed = processedTemplate
      .replace(/{{Client_Name}}/g, client['CUSTOMER NAME'] || '')
      .replace(/{{Loan_Account_Number}}/g, client['CL CONTRACT ID']|| '')
      .replace(/{{email}}/g, client['BORRWER EMAIL ID'] || '')
      .replace(/{{customerId}}/g, client['CUSTOMER ID'] || '')
      .replace(/{{zone}}/g, client['ZONE'] || '')
      .replace(/{{state}}/g, client['STATE'] || '');

    console.log('Processed template:', processed);
    return processed;
  } catch (error) {
    console.error('Error processing template:', error);
    return '';
  }
};

exports.shareByEmail = async (req, res) => {
  try {
    const { clientId,batchId } = req.body;
    // console.log('Received request for email sharing:', { clientId, documentUrl });

    // const client = getClientData(clientId);
    // if (!client) {
    //   console.error('Client not found:', clientId);
    //   return res.status(404).json({ 
    //     error: 'Client not found',
    //     details: 'Unable to find client data in Excel file'
    //   });
    // }
   const documentUrl="https://res.cloudinary.com/duiy6ecai/image/upload/v1743243648/New_Legal_Documents/ewfnpckx07bq0ylqmleq.pdf";
    // const customMessage = processTemplate(messageTemplate, client);
    const emailBody =  'Here is your document from Legal Doc Sharing.';
    const htmlBody = `<p>${emailBody}</p><p><a href="${documentUrl}">Click here to view your document</a></p>`;

    // Log the email details
    // console.log('Sending email to:', client['BORRWER EMAIL ID']);
    // console.log('Email body:', emailBody);
    const subject='Document of your Case shared by Legal Doc Sharing';
    const recieverEmail = 'jayshrikanth@gmail.com';  //hard coding for webhook testing
    const emailResponse = await sendEmail(
       recieverEmail,
       subject ,
      emailBody,
      htmlBody
    );

    console.log('Email response:', emailResponse);
    const EmailMessagObject={
      clientId,
      batchId,
      messageId:emailResponse.id.slice(1,-1),
      subject,
      body:emailBody,
      recieverEmail,
      senderEmail: 'Legal Doc Sharing',
      status: emailResponse.status
    };
    const message = await MongoService.createEmailMessage(EmailMessagObject);
   console.log("email sent and saved in db",message);
    res.status(200).json({ 
      message: 'Email sent successfully',
    });
  } catch (error) {
    console.error('Error in shareByEmail:', error);
    res.status(500).json({ 
      error: 'Failed to send email',
      details: error.message
    });
  }
};

exports.shareByWhatsApp = async (req, res) => {
  try {
    const { clientId, documentUrl, messageTemplate } = req.body;
    // console.log('Received request for WhatsApp sharing:', { clientId, documentUrl });

    const client = getClientData(clientId);
    if (!client) {
      console.error('Client not found:', clientId);
      return res.status(404).json({ 
        error: 'Client not found',
        details: 'Unable to find client data in Excel file'
      });
    }

    const customMessage = processTemplate(messageTemplate, client);
    const messageBody = `${customMessage}\n\nClick here to view your document: ${documentUrl}`;

    console.log('Sending WhatsApp to:', client['BORRWER PHONE NUMBER']);
    console.log('Message body:', messageBody);

    await twilioClient.messages.create({
      body: messageBody,
      from: 'whatsapp:+14155238886',
      to: `whatsapp:+91${client['BORRWER PHONE NUMBER']}`
    });

    res.status(200).json({ 
      message: 'WhatsApp message sent successfully',
      processedMessage: customMessage
    });
  } catch (error) {
    console.error('Error in shareByWhatsApp:', error);
    res.status(500).json({ 
      error: 'Failed to send WhatsApp message',
      details: error.message
    });
  }
};

exports.shareBySMS = async (req, res) => {
  try {
    const { clientId, documentUrl, messageTemplate } = req.body;
    console.log('Received message template:', messageTemplate); // Debug log
    
    const client = getClientData(clientId);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const customMessage = processTemplate(messageTemplate, client);
    const messageBody = `${customMessage}\n\nClick here to view your document: ${documentUrl}`;

    await twilioClient.messages.create({
      body: messageBody,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${client['BORRWER PHONE NUMBER']}`
    });

    res.status(200).json({ 
      message: 'SMS sent successfully',
      processedMessage: customMessage // For debugging
    });
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).json({ error: 'Failed to send SMS' });
  }
};

exports.shareAll = async (req, res) => {
  try {
    const { clientId, documentUrl, messageTemplate } = req.body;
    console.log('Received message template:', messageTemplate); // Debug log
    
    const client = getClientData(clientId);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const customMessage = processTemplate(messageTemplate, client);
    const emailBody = customMessage || 'Here is your document from Legal Doc Sharing.';
    const messageBody = `${customMessage}\n\nClick here to view your document: ${documentUrl}`;
    const htmlBody = `<p>${emailBody}</p><p><a href="${documentUrl}">Click here to view your document</a></p>`;

    await Promise.all([
      // Send Email
      sendEmail(
        client['BORRWER EMAIL ID'],
        'Document of your Case shared by Legal Doc Sharing',
        emailBody,
        htmlBody
      ),
      // Send WhatsApp
      twilioClient.messages.create({
        body: messageBody,
        from: 'whatsapp:+14155238886',
        to: `whatsapp:+91${client['BORRWER PHONE NUMBER']}`
      }),
      // Send SMS
      twilioClient.messages.create({
        body: messageBody,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+91${client['BORRWER PHONE NUMBER']}`
      })
    ]);

    res.status(200).json({ 
      message: 'Document shared via all channels successfully',
      processedMessage: customMessage // For debugging
    });
  } catch (error) {
    console.error('Error sharing document via all channels:', error);
    res.status(500).json({ error: 'Failed to share document via all channels' });
  }
};
