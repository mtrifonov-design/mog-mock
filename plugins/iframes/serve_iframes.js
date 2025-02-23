import express from 'express';
import path from 'path';
import fs from 'fs';

const PORT = 3000;
const IFRAME_DIR = path.join(process.cwd(), 'plugins/iframes');

// Express server to serve iframes dynamically
const app = express();
app.use(express.static(IFRAME_DIR));

app.get('/list-plugins', async (req, res) => {
    try {
        const files = await fs.promises.readdir(IFRAME_DIR);
        res.json(files);
    } catch (err) {
        res.status(500).send('Error reading plugins');
    }
});

app.listen(PORT, async () => {
    console.log(`[Server] Iframe Server running at http://localhost:${PORT}`);
});