const express = require('express');
const router = express.Router();
const multer = require('multer');
const excelController = require('../controllers/excelController');

const upload = multer({ dest: 'uploads/' });

router.post('/upload-excel', upload.single('excel'), excelController.uploadExcel);

module.exports = router;

