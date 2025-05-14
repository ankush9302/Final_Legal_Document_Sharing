const WebSocket = require('ws');
const Job = require('../models/Job'); // Adjust the path as needed

class WebSocketService {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.interval = null;
    this.initialize();

    // Make WebSocket server globally available
    global.wss = this.wss;
  }

  initialize() {
    this.wss.on('connection', (ws) => {
      console.log('New client connected');

      // Start the interval only when the first client connects
      if (this.wss.clients.size === 1) {
        this.startBroadcastingJobs();
      }

      ws.on('close', () => {
        console.log('Client disconnected');

        // Stop the interval when all clients disconnect
        if (this.wss.clients.size === 0 && this.interval) {
          clearInterval(this.interval);
          this.interval = null;
          console.log('No clients left. Stopped broadcasting.');
        }
      });
    });
  }

  startBroadcastingJobs() {
    console.log('Started broadcasting job data every 3 seconds');

    this.interval = setInterval(async () => {
      try {
        const job = await Job.findOne({
          status: { $in: ['pending', 'running'] },
        })
          .sort({ createdAt: -1 })
          .limit(10)
          .lean();

        const message = {
          type: 'JOB_STATUS_UPDATE',
          data: job,
        };

        this.wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
          }
        });
        console.log("Broadcasting job data");  
        
      } catch (error) {
        console.error('Error fetching/sending job data:', error.message);
      }
    }, 3000);
  }
}

module.exports = WebSocketService;
