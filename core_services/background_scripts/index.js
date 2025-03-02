import express from 'express';
import fs from 'fs';
import path from 'path';
import { fork } from 'child_process';

const backgroundScripts = express.Router();
const PLUGIN_DIR = path.join(process.cwd(), 'plugins/functional');
const activeProcesses = {}; // Tracks subprocesses by address

// Function to start a subprocess if not already running
function startSubprocess(address) {
    const pluginPath = path.join(PLUGIN_DIR, address, 'index.js');
    if (!fs.existsSync(pluginPath)) {
        console.error(`[Background Scripts] Plugin not found: ${address}`);
        return null;
    }
    
    console.log(`[Background Scripts] Starting subprocess: ${address}`);
    const child = fork(pluginPath);
    activeProcesses[address] = child;

    child.on('message', (msg) => {
        console.log(`[Background Scripts] Message from ${address}:`, msg);
        // Forward message to Conductor
        fetch('http://localhost:9000/conductor/message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(msg),
        }).catch(err => console.error(`[Background Scripts] Error forwarding message:`, err));
    });

    child.on('exit', () => {
        console.log(`[Background Scripts] Subprocess ${address} exited`);
        delete activeProcesses[address];
    });

    return child;
}

// Receive messages from Conductor and route to subprocess
backgroundScripts.post('/', async (req, res) => {
    console.log('[Background Scripts] Received message:', req.body);
    const { target, data } = req.body;

    if (!target) return;
    if (!target) {
        return res.status(400).json({ error: 'Target address missing' });
    }
    
    let process = activeProcesses[target] || startSubprocess(target);
    if (!process) {
        return res.status(404).json({ error: 'Plugin not found' });
    }
    
    process.send(data);
    res.json({ status: 'Message sent to ' + target });
});




export { backgroundScripts };
           