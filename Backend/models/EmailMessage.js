const mongoose = require('mongoose');
const { Schema } = mongoose; // Import Schema

const EmailMessageSchema = new Schema({
    clientId: { type: Schema.Types.ObjectId, ref: 'loanClient' }, // Reference to Client model
    batchId: { type: Schema.Types.ObjectId, ref: 'Batch' }, // Reference to Batch model
    messageId: { type: String, required: true }, // Unique message ID
    subject: { type: String, required: true }, // Email subject
    body: { type: String, required: true }, // Email body content
    status: { 
        type: String, 
        enum: ['Sent', 'Delivered', 'Opened', 'Failed'], // Valid email statuses
        default: 'Not Sent' ,// Default status is 'Not Sent' as we have not tried sending yet i am assuming this
        required: true 
    },
}, { timestamps: true }); // Enable createdAt & updatedAt timestamps

const EmailMessage = mongoose.model('EmailMessage', EmailMessageSchema);

module.exports = EmailMessage;
