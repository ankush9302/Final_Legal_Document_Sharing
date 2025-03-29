const mongoose = require('mongoose');
const { Schema } = mongoose; // Import Schema

const NoticeSchema = new Schema({
    clientId: { type: Schema.Types.ObjectId, ref: 'loanClient' }, // Reference to Client model
    pdfUrl: { type: String, required: false }, // Ensure pdf_url is always provided
    batchId: { type: Schema.Types.ObjectId, ref: 'Batch' }, // Reference to Batch model
    //following may help in future to generate report on the basis of channel message sent on
    whatsAppMessageId:{type:Schema.Types.ObjectId,ref:'whatsAppMessage'} ,
    emailMessageId:{type:Schema.Types.ObjectId,ref:'EmailMessage'},
    smsMessageId:{type:Schema.Types.ObjectId,ref:'smsMessage'},
}, { timestamps: true }); // Adds createdAt & updatedAt automatically

const Notice = mongoose.model('Notice', NoticeSchema);

module.exports = Notice;
