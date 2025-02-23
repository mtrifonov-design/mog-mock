import express from 'express';
import path from 'path';

const ui = express.Router();

ui.get('/', async (req, res) => {
    console.log("HELLO!")
    const UI_DIR = path.join(process.cwd(), 'core_services/ui');
    const indexPath = path.join(UI_DIR, 'index.html');
    console.log(`[UI] Serving index.html from ${indexPath}`);
    
    res.sendFile(indexPath);
});

export { ui };
