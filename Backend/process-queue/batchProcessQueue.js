const Queue = require("bull");
const Job = require("../models/Job");

const path = require('path')
const fs = require('fs');
const loanClient = require("../models/loanClients");
const { sendEmail } = require("../config/email");
const twilioClient = require('../config/twilio');


const MongoService = require('../models/MongoModel');
const { sendWhatsAppMessage, sendWhatsAppMessageTwilio } = require('../services/whatsappService')



const jobQueue = new Queue("batch-process-queue");
const NUM_WORKERS = 1;

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


jobQueue.process(NUM_WORKERS, async ({ data }) => {

    const id = data.id;
    const jobDoc = await Job.findById(id);
    jobDoc.status = "running"
    jobDoc.jobStartTime = Date.now()

    await jobDoc.save()

    const batchId = jobDoc.batchId;

    const clients = await loanClient.find({ batchId }).lean();
    if (!clients || clients.length === 0) {
        
        jobDoc.status = "completed"
        jobDoc.jobEndTime = Date.now()
        jobDoc.clientsTotal = 0;
        jobDoc.clientsCompleted = 0;
        jobDoc.clientsFailed = 0;
        await jobDoc.save();
        console.log("No clients found for this batch");

        return true;
    }

    jobDoc.clientsTotal = clients.length;
    await jobDoc.save();

    try {

        const { body, subject } = jobDoc;

        let countCompleted = 0;
        let countFailed = 0;
        let countTotal = clients.length;

        for (const client of clients) {
            const customMessage = processTemplate(body, client);
            const emailBody = customMessage || 'Here is your document from Legal Doc Sharing.';
            const messageBody = `${customMessage}\n\nClick here to view your document: ${client.documentLink}`;
            const htmlBody = `<p>${emailBody}</p><p><a href="${client.documentLink}">Click here to view your document</a></p>`;



            const results = await Promise.allSettled([
                // Send Email
                sendEmail(
                    client['borrowerEmailId'],
                    subject,
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
                    clientId : client._id,
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
                    clientId : client._id,
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
                    clientId : client._id,
                    batchId,
                    messageId: whatsappResult.value.sid,
                    message: whatsappResult.value.body,
                    status: whatsappResult.value.status
                });
            } else {
                await MongoService.createWhatsAppMessage({
                    clientId : client._id,
                    batchId,
                    messageId: null,
                    message: whatsappResult.reason?.message || "Failed to send WhatsApp message",
                    status: "failed"
                });
            }

            // 📩 SMS logging
            if (smsResult.status === 'fulfilled') {
                await MongoService.createSmsMessage({
                    clientId : client._id,
                    batchId,
                    messageId: smsResult.value.sid,
                    message: smsResult.value.body,
                    status: smsResult.value.status
                });
            } else {
                await MongoService.createSmsMessage({
                    clientId : client._id,
                    batchId,
                    messageId: null,
                    message: smsResult.reason?.message || "Failed to send SMS",
                    status: "failed"
                });
            }

            countCompleted = countCompleted + 1;
            jobDoc.clientsCompleted = countCompleted;
            await jobDoc.save (); 
        }

        

        return true;

    } catch (error) {

        console.log(error);

        jobDoc.status = "completed"

        await jobDoc.save();
        return true;
    }
    finally{
        jobDoc.status = "completed"
        jobDoc.jobEndTime = Date.now()
        await jobDoc.save();
    }

});

jobQueue.on("failed", (error) => {
    console.error(error.data.id, error.failedReason);
});

const addToBatchProcessQueue = async (jobId) => {
    jobQueue.add({
        id: jobId,
    });
};

module.exports = {
    addToBatchProcessQueue,
};