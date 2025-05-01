const express = require('express');
const router = express.Router();
const batchController = require('../controllers/batchController');

router.get('/get-batches', (req, res) => {
    console.log('get-batches route hit:', req.body);
    batchController.getBatches(req, res);
});

module.exports = router;
