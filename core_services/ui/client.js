
// Establish WebSocket connection to Conductor
const ws = new WebSocket('ws://localhost:9001');

console.log('Hello from Client!');

const connectedIframes = document.getElementsByTagName('iframe');

ws.onopen = () => {
    console.log('[UI] Connected to Conductor WebSocket');
};

ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (!message.target) return;

    const target = message.target;
    console.log('[UI] Received message:', message);
    // Reroute messages to connected iframes
    for (let iframe of connectedIframes) {
        console.log(iframe.id, target);
        if (iframe.id !== target) continue;
        iframe.contentWindow.postMessage(message, '*');
    }
};

ws.onerror = (error) => {
    console.error('[UI] WebSocket Error:', error);
};

ws.onclose = () => {
    console.log('[UI] WebSocket Connection Closed');
};


// Receive messages from iframes and forward to Conductor
window.addEventListener('message', (event) => {
    if (!event.data.target) return;
    console.log('[UI] Received message:', event.data);
    // Forward to Conductor
    ws.send(JSON.stringify(event.data));
});

