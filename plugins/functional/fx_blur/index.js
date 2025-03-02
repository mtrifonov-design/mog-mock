
function blur(renderScript,payload, time) {
    const amount = payload.amount;
    renderScript += `ctx.filter = 'blur(${amount * (time / 100)}px)';\n`;
    return renderScript;
}

process.on('message', (msg) => {
    if (msg.command === "get") {
        const target = "render_engine";
        const payload = msg.payload;
        const renderScript = msg.renderScript;
        const time = msg.time;
        process.send({ target, data: { command: 'effect_result', renderScript: blur(renderScript,payload, time) } });
    }
});
