const express = require('express');
const router = express.Router();
const mailgunService = require('../services/mailgunService');

router.post('/mailgun', (req, res) => {
  try {
    // console.log('Received Mailgun webhook', req.body);
    const timestamp = req.body.signature.timestamp;
    const token = req.body.signature.token;
    const signature = req.body.signature.signature;

    mailgunService.handleWebhookEvent(
      req.body, 
      timestamp, 
      token, 
      signature
    );
    res.status(200).send('OK');
  } catch (error) {
    console.error('Error processing Mailgun webhook:', error);
    res.status(500).send('Error processing webhook');
  }
});

module.exports = router; 