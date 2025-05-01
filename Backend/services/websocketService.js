const WebSocket = require('ws');

class WebSocketService {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Set();
    this.initialize();
    
    // Make WebSocket server globally available for mailgun service
    global.wss = this.wss;
  }

  initialize() {
    this.wss.on('connection', (ws) => {
      this.clients.add(ws);
      console.log('New client connected');

      ws.on('close', () => {
        this.clients.delete(ws);
        console.log('Client disconnected');
      });
    });
  }
}

module.exports = WebSocketService;
