const { Message } = require('../models/Message');
const excelService = require('../services/excelService');
const path = require('path');
const XLSX = require('xlsx');
const fs = require('fs');

exports.getEmailStatus = async (req, res) => {
  try {
    const messages = await Message.find()
      .populate('clientId', 'name email')
      .sort({ createdAt: -1 });

    const emailStatus = {};
    messages.forEach(msg => {
      emailStatus[msg.sentTo] = {
        status: msg.email.status,
        opened: msg.email.opened,
        lastUpdated: msg.updatedAt
      };
    });

    // Update Excel with email status
    const excelPath = path.join(__dirname, '..', 'uploads', 'updated_excel.xlsx');
    if (!fs.existsSync(excelPath)) {
      console.error('Excel file not found at:', excelPath);
      return null;
    }
    const workbook = XLSX.readFile(excelPath);
    await excelService.updateExcelWithEmailStatus(workbook, emailStatus);

    res.json(messages);
  } catch (error) {
    console.error('Error fetching email status:', error);
    res.status(500).json({ error: 'Failed to fetch email status' });
  }
};

exports.getFailedEmails = async (req, res) => {
  try {
    const failedEmails = await Message.find({
      'email.status': 'failed'
    })
    .populate('clientId', 'name email')
    .sort({ createdAt: -1 });

    res.json(failedEmails);
  } catch (error) {
    console.error('Error fetching failed emails:', error);
    res.status(500).json({ error: 'Failed to fetch failed emails' });
  }
};

exports.getSuccessfulEmails = async (req, res) => {
  try {
    const successfulEmails = await Message.find({
      'email.status': 'delivered'
    })
    .populate('clientId', 'name email')
    .sort({ createdAt: -1 });

    res.json(successfulEmails);
  } catch (error) {
    console.error('Error fetching successful emails:', error);
    res.status(500).json({ error: 'Failed to fetch successful emails' });
  }
};

exports.getOpenedEmails = async (req, res) => {
  try {
    const openedEmails = await Message.find({
      'email.opened': true
    })
    .populate('clientId', 'name email')
    .sort({ createdAt: -1 });

    res.json(openedEmails);
  } catch (error) {
    console.error('Error fetching opened emails:', error);
    res.status(500).json({ error: 'Failed to fetch opened emails' });
  }
}; 