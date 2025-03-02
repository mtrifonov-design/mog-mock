import express from 'express';
import fs from 'fs';
import path from 'path';
import { fork } from 'child_process';
import { conductor } from './core_services/conductor/index.js';
import { backgroundScripts } from './core_services/background_scripts/index.js';

// emulate iframes being hosted in a separate server
const IFRAME_SERVER = path.join(process.cwd(), 'plugins/iframes/serve_iframes.js');
const iframeServer = fork(IFRAME_SERVER);

// run core server
const PORT = 9000;
const app = express();
app.use(express.json());

app.use('/conductor', conductor);
const UI_DIR = path.join(process.cwd(), 'core_services/ui');
app.use('/ui', express.static(UI_DIR));
app.use('/background_scripts', backgroundScripts);


app.listen(PORT, () => {
    console.log(`[Server] Listening on port ${PORT}`);
});

