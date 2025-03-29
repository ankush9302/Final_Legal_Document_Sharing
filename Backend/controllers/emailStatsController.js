const mailgunService = require('../services/mailgunService');

exports.getEmailStats = async (req, res) => {
  try {
    const stats = await mailgunService.getEmailStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch email stats' });
  }
};