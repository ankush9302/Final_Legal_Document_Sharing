const crypto = require('crypto');
const Message = require('../models/Message');

const verifyWebhookSignature = (timestampmailgun, token, signature) => {
  const encodedToken = crypto
    .createHmac('sha256', process.env.MAILGUN_WEBHOOK_SIGNING_KEY)
    .update(timestampmailgun.concat(token))
    .digest('hex');
  return encodedToken === signature;
};

exports.handleWebhook = async (req, res) => {
  try {
    // Verify webhook signature
    const { signature, timestamp, token } = req.body;
    if (!verifyWebhookSignature(timestamp, token, signature)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const { event, recipient, clientId } = req.body;
    const timestampmailgun = new Date(req.body.timestampmailgun * 1000);

    switch (event) {
      case 'delivered':
        await Message.findOneAndUpdate(
          { clientId },
          { 
            $set: {
              'email.status': 'delivered',
              'email.deliveredAt': timestampmailgun
            }
          }
        );
        break;

      case 'opened':
        await Message.findOneAndUpdate(
          { clientId },
          { 
            $set: { 'email.status': 'opened' },
            $push: { 'email.openedAt': timestampmailgun }
          }
        );
        break;

      case 'clicked':
        await Message.findOneAndUpdate(
          { clientId },
          { 
            $set: { 'email.status': 'clicked' },
            $push: { 
              'email.clickedAt': timestampmailgun,
              'email.clickedLinks': req.body.url
            }
          }
        );
        break;

      case 'bounced':
        await Message.findOneAndUpdate(
          { clientId },
          { 
            $set: {
              'email.status': 'bounced',
              'email.bounceInfo': {
                code: req.body.code,
                error: req.body.error,
                timestampmailgun
              }
            }
          }
        );
        break;
    }

    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Error processing Mailgun webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};