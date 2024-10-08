const express = require('express');
const router = express.Router();
const shareController = require('../controllers/shareController');

router.post('/share/email', shareController.shareByEmail);
router.post('/share/whatsapp', shareController.shareByWhatsApp);
router.post('/share/sms', shareController.shareBySMS);

module.exports = router;
