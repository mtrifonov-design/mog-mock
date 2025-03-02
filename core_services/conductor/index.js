import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import fetch from 'node-fetch';

const conductor = express.Router();
const clients = new Set(); // Store WebSocket connections

// WebSocket Server
const server = http.createServer();
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
    console.log('[Conductor] UI client connected via WebSocket');
    clients.add(ws);

    ws.on('close', () => {
        console.log('[Conductor] UI client disconnected');
        clients.delete(ws);
    });

    // forward messages
    ws.on('message', async (message) => {
        message = JSON.parse(message);
        console.log('[Conductor] Received message from UI client:', message);

        if (!message.target) return;
        try {
            await forwardMessage(message);
        } catch (err) {
            console.error('[Conductor] Error parsing message:', err);
        }
    });
});

// Function to forward messages
async function forwardMessage(message) {
    console.log(`[Conductor] Forwarding message:`, JSON.stringify(message));

    // Forward to background_scripts via HTTP
    try {
        await fetch('http://localhost:9000/background_scripts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message),
        });
    } catch (err) {
        console.error('[Conductor] Error forwarding to background_scripts:', err);
    }

    // Forward to all connected UI clients via WebSockets
    clients.forEach((ws) => {
        if (ws.readyState === ws.OPEN) {
            ws.send(JSON.stringify(message));
        }
    });
}

// Conductor receives messages
conductor.post('/message', async (req, res) => {
    const message = req.body;
    console.log(`[Conductor] Received message:`, message);

    await forwardMessage(message);
    res.json({ status: 'Message forwarded' });
});




// Start WebSocket Server
server.listen(9001, () => {
    console.log('[Conductor] WebSocket server running on ws://localhost:9001');
});

export { conductor };
