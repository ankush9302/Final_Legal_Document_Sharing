// console.log('ShareController loaded');
const { sendEmail } = require('../config/email');
const twilioClient = require('../config/twilio');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const MongoService = require('../models/MongoModel');
const loanClient = require('../models/loanClients');
const { sendWhatsAppMessage, sendWhatsAppMessageTwilio } = require('../services/whatsappService')
const MongooseService = require("../models/MongoModel");

// Improved getClientData function with better error handling and logging
const getClientData = async (clientId) => {
  try {

    const client = await loanClient.findOne({ '_id': clientId }).lean();

    // console.log('Client Found Data:', client);

    if (!client) {
      console.log('Client not found with ID:', clientId);
      return null;
    }

    console.log('Found client');
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
      .replace(/{{Client_Name}}/g, client['customerName'] || '')
      .replace(/{{Loan_Account_Number}}/g, client['finalLoanId'] || '')
      .replace(/{{email}}/g, client['borrowerEmailId'] || '')
      .replace(/{{customerId}}/g, client['clContractId'] || '')
      .replace(/{{zone}}/g, client['zone'] || '')
      .replace(/{{state}}/g, client['state'] || '');

    console.log('Processed template:', processed);
    return processed;
  } catch (error) {
    console.error('Error processing template:', error);
    return '';
  }
};

exports.shareByEmail = async (req, res) => {
  try {
    const { clientId , documentUrl } = req.body;
    const { batchId } = req.params
    // console.log('Received request for email sharing:', { clientId, documentUrl });

    const client = await getClientData(clientId);
    if (!client) {
      console.error('Client not found:', clientId);
      return res.status(404).json({
        error: 'Client not found',
        details: 'Unable to find client data from database'
      });
    }
    // const customMessage = processTemplate(messageTemplate, client);
    const emailBody = 'Here is your document from Legal Doc Sharing.';
    const htmlBody = `<p>${emailBody}</p><p><a href="${documentUrl}">Click here to view your document</a></p>`;

    // Log the email details
    // console.log('Sending email to:', client['BORRWER EMAIL ID']);
    // console.log('Email body:', emailBody);
    const subject = 'Document of your Case shared by Legal Doc Sharing';
    // const recieverEmail = 'jayshrikanth@gmail';  //hard coding for webhook testing
    const recieverEmail = client['borrowerEmailId']; // Use the email from the client datas

    //Function will not THROW error.
    const emailResponse = await sendEmail(
      recieverEmail,
      subject,
      emailBody,
      htmlBody
    );

    console.log('Email response:', emailResponse);
    const EmailMessagObject = {
      clientId,
      batchId,
      messageId: emailResponse.id?.slice(1, -1) || null,
      subject,
      body: emailBody,
      recieverEmail,
      senderEmail: 'Legal Doc Sharing',
      status: emailResponse.status
    };
    const message = await MongoService.createEmailMessage(EmailMessagObject);
    console.log("email sent and saved in db", message);
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
    const { clientId, messageTemplate, documentUrl } = req.body;
    const { batchId } = req.params

    const client = await getClientData(clientId);
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }
    const customMessage = processTemplate(messageTemplate, client);
    const messageBody = `${customMessage}\n\nClick here to view your document: ${documentUrl}`;

    console.log("Sending WhatsApp to:", client.borrowerPhoneNumber);

    let response = null;

    try {
      const TwilioResponse = await sendWhatsAppMessageTwilio(client.borrowerPhoneNumber, messageBody);
      response = TwilioResponse;
    }
    catch (error) {
      console.error("Error sending WhatsApp message:", error);
      if (error.code && error.moreInfo?.includes('twilio.com')) {

        const whatsappMessageObject = {
          clientId,
          batchId,
          messageId: null,
          message: error.message,
          status: "failed",
        }
        const messageResult = await MongooseService.createWhatsAppMessage(whatsappMessageObject)
      }
      else {
        const whatsappMessageObject = {
          clientId,
          batchId,
          messageId: null,
          message: "Failed to send message.",
          status: "failed",
        }
        const messageResult = await MongooseService.createWhatsAppMessage(whatsappMessageObject)
      }

      throw new Error("Failed to send WhatsApp message");
    }

    const whatsappMessageObject = {
      clientId,
      batchId,
      messageId: response.sid,
      message: response.body,
      status: response.status,
    }
    const messageResult = await MongooseService.createWhatsAppMessage(whatsappMessageObject)


    res.status(200).json({
      message: "WhatsApp message sent successfully",
      response,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.shareBySMS = async (req, res) => {
  try {
    const { clientId, documentUrl, messageTemplate } = req.body;
    const { batchId } = req.params
    console.log('Received message template:', messageTemplate); // Debug log

    const client = await getClientData(clientId);
    console.log("client ka data : ", client['borrowerPhoneNumber']);

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const customMessage = processTemplate(messageTemplate, client);
    const messageBody = `${customMessage}\n\nClick here to view your document: ${documentUrl}`;

    let response = null;
    try {
      const twilioResponse = await twilioClient.messages.create({
        body: messageBody,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+91${client.borrowerPhoneNumber}`
      });
      response = twilioResponse;
    }
    catch (error) {
      console.error("Error sending sms message:", error);
      if (error.code && error.moreInfo?.includes('twilio.com')) {

        const smsMessageObject = {
          clientId,
          batchId,
          messageId: null,
          message: error.message,
          status: "failed",
        }
        const messageResult = await MongooseService.createSmsMessage(smsMessageObject)
      }
      else {
        const smsMessageObject = {
          clientId,
          batchId,
          messageId: null,
          message: "Failed to send message.",
          status: "failed",
        }
        const messageResult = await MongooseService.createSmsMessage(smsMessageObject)
      }

      throw new Error("Failed to send WhatsApp message");
    }



    const smsMessageObject = {
      clientId,
      batchId,
      messageId: response.sid,
      message: response.body,
      status: response.status,
    }
    const messageResult = await MongooseService.createSmsMessage(smsMessageObject)


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
    const { batchId } = req.params
    console.log('Received message template:', messageTemplate); // Debug log

    const client = await getClientData(clientId);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const customMessage = processTemplate(messageTemplate, client);
    const emailBody = customMessage || 'Here is your document from Legal Doc Sharing.';
    const messageBody = `${customMessage}\n\nClick here to view your document: ${documentUrl}`;
    const htmlBody = `<p>${emailBody}</p><p><a href="${documentUrl}">Click here to view your document</a></p>`;
    const subject = 'Document of your Case shared by Legal Doc Sharing';

    const results = await Promise.allSettled([
      // Send Email
      sendEmail(
        client['borrowerEmailId'],
        'Document of your Case shared by Legal Doc Sharing',
        emailBody,
        htmlBody
      ),
      // Send WhatsApp
      twilioClient.messages.create({
        body: messageBody,
        from: 'whatsapp:+14155238886',
        to: `whatsapp:+91${client['borrowerPhoneNumber']}`
      }),
      // Send SMS
      twilioClient.messages.create({
        body: messageBody,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+91${client['borrowerPhoneNumber']}`
      })
    ]);


    // Process results
    const [emailResult, whatsappResult, smsResult] = results;
    
    
    // 📧 Email logging
    if (emailResult.status === 'fulfilled') {
      await MongoService.createEmailMessage({
        clientId,
        batchId,
        messageId: emailResult.value.id?.slice(1, -1) || null,
        subject,
        body: emailBody,
        recieverEmail: client.borrowerEmailId,
        senderEmail: 'Legal Doc Sharing',
        status: emailResult.value.status
      });
      
    } else {
      await MongoService.createEmailMessage({
        clientId,
        batchId,
        messageId: null,
        subject,
        body: emailBody,
        recieverEmail: client.borrowerEmailId,
        senderEmail: 'Legal Doc Sharing',
        status: 'failed',
        error: emailResult.reason?.message
      });
    }

    // 📲 WhatsApp logging
    if (whatsappResult.status === 'fulfilled') {
      await MongoService.createWhatsAppMessage({
        clientId,
        batchId,
        messageId: whatsappResult.value.sid,
        message: whatsappResult.value.body,
        status: whatsappResult.value.status
      });
    } else {
      await MongoService.createWhatsAppMessage({
        clientId,
        batchId,
        messageId: null,
        message: whatsappResult.reason?.message || "Failed to send WhatsApp message",
        status: "failed"
      });
    }

    // 📩 SMS logging
    if (smsResult.status === 'fulfilled') {
      await MongoService.createSmsMessage({
        clientId,
        batchId,
        messageId: smsResult.value.sid,
        message: smsResult.value.body,
        status: smsResult.value.status
      });
    } else {
      await MongoService.createSmsMessage({
        clientId,
        batchId,
        messageId: null,
        message: smsResult.reason?.message || "Failed to send SMS",
        status: "failed"
      });
    }    


    res.status(200).json({
      message: 'Document shared via all channels successfully',
      processedMessage: customMessage // For debugging
    });
  } catch (error) {
    console.error('Error sharing document via all channels:', error);
    res.status(500).json({ error: 'Failed to share document via all channels' });
  }
};
