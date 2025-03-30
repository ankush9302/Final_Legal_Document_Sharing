const mailgun = require('mailgun-js');
const axios = require('axios');
const WebSocket = require('ws');

class MailgunWebhookService {
  constructor() {
    this.mg = mailgun({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN,
      host: 'api.eu.mailgun.net'
    });
    // console.log('MailgunWebhookService initialized with domain:', process.env.MAILGUN_DOMAIN);
  }

  async getEmailStats() {
    try {
      const now = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);

      // Format dates according to RFC specification
      // Example format: "Wed, 12 Feb 2020 15:30:00 +0000"
      function formatRFCDate(date) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        const dayName = days[date.getUTCDay()];
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = months[date.getUTCMonth()];
        const year = date.getUTCFullYear();
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');
        
        return `${dayName}, ${day} ${month} ${year} ${hours}:${minutes}:${seconds} +0000`;
      }

      const startDate = formatRFCDate(thirtyDaysAgo);
      const endDate = formatRFCDate(now);

      // console.log('Fetching stats from:', startDate, 'to:', endDate);

      const response = await axios({
        method: 'post',
        url: 'https://api.mailgun.net/v1/analytics/metrics',
        auth: {
          username: 'api',
          password: process.env.MAILGUN_API_KEY
        },
        data: {
          resolution: 'month',
          metrics: [
            'accepted_count',
            'delivered_count',
            'failed_count',
            'opened_count',
            'clicked_count',
            'opened_rate',
            'clicked_rate'
          ],
          include_aggregates: true,
          start: startDate,
          end: endDate,
          duration: '1m',
          filter: {
            AND: [{
              attribute: 'domain',
              comparator: '=',
              values: [{
                label: process.env.MAILGUN_DOMAIN,
                value: process.env.MAILGUN_DOMAIN
              }]
            }]
          }
        }
      });

      // console.log('Raw Mailgun Response:', JSON.stringify(response.data, null, 2));
      
      const stats = this.processStats(response.data);
      // console.log('Processed Stats:', stats);
      
      return stats;
    } catch (error) {
      console.error('Error fetching email stats:', error.response?.data || error);
      throw error;
    }
  }

  processStats(data) {
    try {
      // console.log('Processing stats data:', data);

      // Extract metrics from aggregates
      const metrics = data.aggregates?.metrics || {};
      
      const stats = {
        total: metrics.accepted_count || 0,
        accepted: metrics.accepted_count || 0,
        delivered: metrics.delivered_count || 0,
        failed: metrics.failed_count || 0,
        opened: metrics.opened_count || 0,
        clicked: metrics.clicked_count || 0,
        openRate: parseFloat(metrics.opened_rate || 0) * 100,
        clickRate: parseFloat(metrics.clicked_rate || 0) * 100,
        dailyStats: data.data || []
      };

      // console.log('Processed stats:', stats);
      return stats;
    } catch (error) {
      console.error('Error processing stats:', error);
      return {
        total: 0,
        accepted: 0,
        delivered: 0,
        failed: 0,
        opened: 0,
        clicked: 0,
        openRate: 0,
        clickRate: 0,
        dailyStats: []
      };
    }
  }

  handleWebhookEvent(event) {
    try {
      console.log('Received webhook event:', JSON.stringify(event, null, 2));
      
      const eventData = {
        type: event['event-data'].event,
        recipient: event['event-data'].recipient,
        timestamp: event['event-data'].timestamp,
        messageId: event['event-data'].message.headers['message-id']
      };

      console.log('Processed webhook event data:', eventData);

      // Broadcast both the event and updated stats
      // this.broadcastUpdate(eventData);
    } catch (error) {
      console.error('Error processing webhook event:', error);
    }
  }

  async broadcastUpdate(eventData) {
    try {
      // console.log('Broadcasting update for event:', eventData);
      
      // Get updated stats after receiving an event
      const stats = await this.getEmailStats();
      // console.log('Updated stats for broadcast:', stats);

      if (global.wss) {
        console.log('WebSocket server found, broadcasting to clients');
        global.wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            console.log('Sending update to WebSocket client');
            // Send both event and stats update
            client.send(JSON.stringify({
              type: 'MAILGUN_EVENT',
              data: eventData
            }));

            client.send(JSON.stringify({
              type: 'EMAIL_STATS_UPDATE',
              data: stats
            }));
          }
        });
      } else {
        console.log('No WebSocket server found');
      }
    } catch (error) {
      console.error('Error broadcasting update:', error);
    }
  }
}

module.exports = new MailgunWebhookService();