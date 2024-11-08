const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfProcessingController = require('../controllers/pdfProcessingController');

const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.fields([
  { name: 'pdf', maxCount: 1 },
  { name: 'excel', maxCount: 1 }
]), (req, res, next) => {
  pdfProcessingController.uploadAndProcessFiles(req, res, next).catch(next);
});

module.exports = router;
