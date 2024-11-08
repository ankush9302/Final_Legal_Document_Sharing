const express = require('express');
const router = express.Router();
const shareController = require('../controllers/shareController');

router.post('/email', shareController.shareByEmail);
router.post('/whatsapp', shareController.shareByWhatsApp);
router.post('/sms', shareController.shareBySMS);
router.post('/all', shareController.shareAll);

module.exports = router;
