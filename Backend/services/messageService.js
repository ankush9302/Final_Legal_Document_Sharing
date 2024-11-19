const Message = require('../models/Message');

const createMessage = async (messageData) => {
  try {
    const message = new Message(messageData);
    return await message.save();
  } catch (error) {
    throw new Error(`Error creating message: ${error.message}`);
  }
};

const updateMessageStatus = async (clientId, channel, status) => {
  try {
    return await Message.updateDeliveryStatus(clientId, channel, status);
  } catch (error) {
    throw new Error(`Error updating message status: ${error.message}`);
  }
};

const getMessagesByClientId = async (clientId) => {
  try {
    return await Message.find({ clientId });
  } catch (error) {
    throw new Error(`Error fetching messages: ${error.message}`);
  }
};

const createOrUpdateMessage = async (messageData) => {
  try {
    const { clientId, channel, status, sentTo, sender, documentLink } = messageData;
    
    // Validate channel
    if (!['email', 'whatsapp', 'sms'].includes(channel)) {
      throw new Error('Invalid channel specified');
    }

    // Create update object
    const update = {
      [`${channel}.status`]: status,
      [`${channel}.sentAt`]: new Date()
    };

    // If document doesn't exist, add these required fields
    const setOnInsert = {
      clientId,
      sentTo,
      sender,
      documentLink
    };

    const message = await Message.findOneAndUpdate(
      { clientId },
      {
        $set: update,
        $setOnInsert: setOnInsert
      },
      {
        new: true,
        upsert: true
      }
    );

    return message;
  } catch (error) {
    throw new Error(`Error in createOrUpdateMessage: ${error.message}`);
  }
};

module.exports = {
  createMessage,
  updateMessageStatus,
  getMessagesByClientId,
  createOrUpdateMessage
};
