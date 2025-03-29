const mongoose = require('mongoose');
const { Schema } = mongoose; // Import Schema

const WhatsappMessageSchema = new Schema({
    clientId: { type: Schema.Types.ObjectId, ref: 'loanClient' }, // Reference to Client model
    batchId: { type: Schema.Types.ObjectId, ref: 'Batch' }, // Reference to Batch model
    messageId: { type: String, required: true }, // Ensure messageId is always provided
    message: { type: String, }, // Ensure message is required
    status: { 
        type: String, 
        enum: ['Sent', 'Delivered', 'OngamepadConnected', 'Failed'], // Valid statuses
        default: 'Not Sent' ,// Default status is 'Not Sent' Assuming no message sending was tried 
        required: true 
    },
}, { timestamps: true }); // Correct timestamps option

const whatsAppMessage = mongoose.model('WhatsappMessage', WhatsappMessageSchema);

module.exports = whatsAppMessage;
