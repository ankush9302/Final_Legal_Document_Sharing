const Message = require('../models/Message');

exports.getDashboardData = async (req, res) => {
  try {
    // Get email statistics
    const emailStats = await Message.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          sent: {
            $sum: {
              $cond: [{ $eq: ["$email.status", "sent"] }, 1, 0]
            }
          },
          failed: {
            $sum: {
              $cond: [{ $eq: ["$email.status", "failed"] }, 1, 0]
            }
          },
          pending: {
            $sum: {
              $cond: [{ $eq: ["$email.status", "pending"] }, 1, 0]
            }
          }
        }
      }
    ]);

    // Get other dashboard data--->irrelevant hai ye code
    const dashboardData = {
      totalClients: await Client.countDocuments(),
      totalDocuments: await Document.countDocuments(),
      documentsSentToday: await Message.countDocuments({
        'email.sentAt': {
          $gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }),
      recentUploads: await Document.countDocuments({
        createdAt: {
          $gte: new Date(new Date().setDate(new Date().getDate() - 7))
        }
      }),
      emailStats: emailStats[0] || {
        total: 0,
        sent: 0,
        failed: 0,
        pending: 0
      }
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

exports.getFailedEmails = async (req, res) => {
  try {
    const failedEmails = await Message.find({
      'email.status': 'failed'
    })
    .populate('clientId', 'name')
    .sort({ createdAt: -1 });

    res.json(failedEmails);
  } catch (error) {
    console.error('Error fetching failed emails:', error);
    res.status(500).json({ error: 'Failed to fetch failed emails' });
  }
};