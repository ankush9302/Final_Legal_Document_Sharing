const mongoose = require('mongoose');

// Define status enum for delivery channels
const deliveryStatus = {
  SENT: 'sent',
  FAILED: 'failed',
  PENDING: 'pending',
  NOT_ATTEMPTED: 'not_attempted'
};

const messageSchema = new mongoose.Schema({
  clientId: { //will be the id of the user who is receiving the document
    type: String,
    required: true,
    index: true
  },
  sentTo: {  //will be the name of the user who is receiving the document
    type: String,
    required: true,
    trim: true
  },
  sender: { //will be the id of the user who is sending the document
    type: String,
    ref: 'User',
    required: true
  },
  documentLink: { //will be the link to the document
    type: String,
    required: true
  },
 
  whatsapp: { //will be the delivery status of the whatsapp message
    status: {
      type: String,
      enum: Object.values(deliveryStatus),
      default: deliveryStatus.NOT_ATTEMPTED
    },
    sentAt: Date
  },
  email: { //will be the delivery status of the email
    status: {
      type: String,
      enum: ['not_attempted', 'sent', 'delivered', 'failed', 'bounced', 'opened', 'clicked'],
      default: 'not_attempted'
    },
    mailgunId: String,
    sentAt: Date,
    deliveredAt: Date,
    openedAt: [Date],
    clickedAt: [Date],
    clickedLinks: [String],
    bounceInfo: {
      code: String,
      error: String,
      timestamp: Date
    },
    isAuthorizedRecipient: {
      type: Boolean,
      default: false
    }
  },

  sms: {
    status: {
      type: String,
      enum: Object.values(deliveryStatus),
      default: deliveryStatus.NOT_ATTEMPTED
    },
    sentAt: Date
  }
}, {
  timestamps: {
    createdAt: true,
    updatedAt: true,
    
  }
});

messageSchema.statics.updateDeliveryStatus = async function(clientId, channel, status) {
  const update = {
    [`${channel}.status`]: status,
    [`${channel}.sentAt`]: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  return this.findOneAndUpdate(
    { clientId },
    { $set: update },
    { new: true, upsert: true }
  );
};

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;