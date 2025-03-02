function circle(renderScript, payload) {
    const radius = payload.radius;
    const fill = payload.fill;
    renderScript += `ctx.beginPath();\n`;
    renderScript += `ctx.arc(100, 75, ${radius}, 0, 2 * Math.PI);\n`;
    renderScript += `ctx.fillStyle = '${fill}';\n`;
    renderScript += `ctx.fill();\n`;
    renderScript += `ctx.closePath();\n`;
    return renderScript;
}

process.on('message', (msg) => {
    if (msg.command === "get") {
        const target = "render_engine";
        const payload = msg.payload;
        const renderScript = msg.renderScript;
        process.send({ target, data: { command: 'effect_result', renderScript: circle(renderScript,payload) } });
    }
});
