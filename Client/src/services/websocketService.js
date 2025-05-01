class WebSocketService {
  constructor() {
    this.ws = null;
    this.subscribers = new Set();
  }

  connect() {
    this.ws = new WebSocket(`ws://${window.location.hostname}:5000`);

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'EMAIL_STATS_UPDATE') {
        this.notifySubscribers(message.data);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected. Reconnecting...');
      setTimeout(() => this.connect(), 5000);
    };
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notifySubscribers(data) {
    this.subscribers.forEach(callback => callback(data));
  }
}

export default new WebSocketService(); 