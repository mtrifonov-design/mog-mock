process.on('message', (msg) => {
    console.log(`[Plugin] Received message:`, msg);
    process.send({ response: `Hello processed: ${msg.data}` });
});
