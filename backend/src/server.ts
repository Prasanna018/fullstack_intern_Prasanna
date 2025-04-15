// src/server.ts
import http from 'http';
import app from './app';
import { initializeWebSocket } from './sockets/taskSockets';

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket server
initializeWebSocket(server);

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});