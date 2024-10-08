const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');

router.get('/document-links', documentController.getDocumentLinks);

module.exports = router;