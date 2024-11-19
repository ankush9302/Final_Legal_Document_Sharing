const express = require('express');
const router = express.Router();
const shareController = require('../controllers/shareController');

router.post('/email', (req, res) => {
    console.log('Email route hit:', req.body);
    shareController.shareByEmail(req, res);
});

router.post('/whatsapp', (req, res) => {
    console.log('WhatsApp route hit:', req.body);
    shareController.shareByWhatsApp(req, res);
});

router.post('/sms', (req, res) => {
    console.log('SMS route hit:', req.body);
    shareController.shareBySMS(req, res);
});

router.post('/all', (req, res) => {
    console.log('Share all route hit:', req.body);
    shareController.shareAll(req, res);
});

module.exports = router;
