// src/sockets/taskSocket.ts
import WebSocket from 'ws';
import http from 'http';

let wss: WebSocket.Server;

// Initialize WebSocket server
export const initializeWebSocket = (server: http.Server): void => {
    wss = new WebSocket.Server({ server });

    wss.on('connection', (ws: WebSocket) => {
        console.log('Client connected to WebSocket');

        ws.on('message', (message: string) => {
            console.log(`Received message: ${message}`);
        });

        ws.on('close', () => {
            console.log('Client disconnected from WebSocket');
        });

        // Send initial connection confirmation
        ws.send(JSON.stringify({
            type: 'connection_established',
            message: 'Connected to Task Management WebSocket Server'
        }));
    });
};

// Broadcast event to all connected clients
export const broadcastEvent = (eventType: string, payload: any): void => {
    if (!wss) {
        console.error('WebSocket server not initialized');
        return;
    }

    const message = JSON.stringify({
        type: eventType,
        payload
    });

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
};