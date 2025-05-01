const mongoose = require('mongoose');
const { Schema } = mongoose; // Import Schema

const EmailMessageSchema = new Schema({
    clientId: { type: Schema.Types.ObjectId, ref: 'loanClient' }, // Reference to Client model
    messageId:String,// returned by mailgun
    batchId: { type: Schema.Types.ObjectId, ref: 'Batch' }, // Reference to Batch model
    subject: { type: String, required: true }, // Email subject
    body: { type: String, required: true }, // Email body content
    recieverEmail:String,
    senderEmail:String,
    status: { 
        type: String, 
        enum: ['sent', 'delivered', 'opened', 'failed','clicked'], // Valid email statuses
        default: 'sent' ,// Default status is 'Not Sent' as we have not tried sending yet i am assuming this
        required: true 
    },
}, { timestamps: true }); // Enable createdAt & updatedAt timestamps

const EmailMessage = mongoose.model('EmailMessage', EmailMessageSchema);

module.exports = EmailMessage;
