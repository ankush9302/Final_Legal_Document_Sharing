const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
    pdfOriginalName: { type: String, required: true },
    pdfUrl: { type: String, required: true },
    excelOriginalName: { type: String, required: true },
    excelUrl: { type: String, required: true },
    pagesPerSplit: { type: Number, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

const Batch = mongoose.model('Batch', batchSchema);
module.exports = Batch;
