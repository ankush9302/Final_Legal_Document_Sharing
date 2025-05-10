const mongoose = require('mongoose');
const { Schema } = mongoose;
const SmsMessageSchema = new Schema({
    clientId: { type: Schema.Types.ObjectId, ref: 'Client' }, // Reference to Client model
    batchId: { type: Schema.Types.ObjectId, ref: 'Batch' }, // Reference to Batch model
    messageId: { type: String }, // Unique message ID
    message: { type: String, required: true }, // what message we sent its  content
    status: { 
        type: String, 
        enum: ["queued" , "sent", "delivered", "read", "failed"], // Updated valid statuses
        default: "queued",
        required: true ,
    },
}, { timestamps: true }); //
const SmsMessage=mongoose.model('SmsMessage',SmsMessageSchema);
module.exports = SmsMessage;