const mongoose = require('mongoose');
const { Schema } = mongoose;
const SmsMessageSchema = new Schema({
    clientId: { type: Schema.Types.ObjectId, ref: 'Client' }, // Reference to Client model
    batchId: { type: Schema.Types.ObjectId, ref: 'Batch' }, // Reference to Batch model
    messageId: { type: String, required: true }, // Unique message ID
    message: { type: String, required: true }, // what message we sent its  content
    status: { 
        type: String, 
        enum: ['Sent', 'Failed'], // Valid email statuses
        required: true ,
        Default:'Not Sent'
    },
}, { timestamps: true }); //
const smsMessage=mongoose.model('SmsMessage',SmsMessageSchema);
module.export = smsMessage;