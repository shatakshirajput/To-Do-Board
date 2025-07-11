import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect() {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    this.socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.isConnected = false;
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  getSocket() {
    return this.socket;
  }

  // Listen for task events
  onTaskCreated(callback) {
    if (this.socket) {
      this.socket.on('taskCreated', callback);
    }
  }

  onTaskUpdated(callback) {
    if (this.socket) {
      this.socket.on('taskUpdated', callback);
    }
  }

  onTaskDeleted(callback) {
    if (this.socket) {
      this.socket.on('taskDeleted', callback);
    }
  }

  // Remove event listeners
  offTaskCreated() {
    if (this.socket) {
      this.socket.off('taskCreated');
    }
  }

  offTaskUpdated() {
    if (this.socket) {
      this.socket.off('taskUpdated');
    }
  }

  offTaskDeleted() {
    if (this.socket) {
      this.socket.off('taskDeleted');
    }
  }
}

// Create singleton instance
const socketService = new SocketService();
export default socketService; 