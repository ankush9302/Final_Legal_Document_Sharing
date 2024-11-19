const mongoose = require('mongoose');

// Define status enum for delivery channels
const deliveryStatus = {
  SENT: 'sent',
  FAILED: 'failed',
  PENDING: 'pending',
  NOT_ATTEMPTED: 'not_attempted'
};

const messageSchema = new mongoose.Schema({
  clientId: {
    type: String,
    required: true,
    index: true
  },
  sentTo: {
    type: String,
    required: true,
    trim: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  documentLink: {
    type: String,
    required: true
  },
 
  whatsapp: {
    status: {
      type: String,
      enum: Object.values(deliveryStatus),
      default: deliveryStatus.NOT_ATTEMPTED
    },
    sentAt: Date
  },
  email: {
    status: {
      type: String,
      enum: Object.values(deliveryStatus),
      default: deliveryStatus.NOT_ATTEMPTED
    },
    sentAt: Date
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