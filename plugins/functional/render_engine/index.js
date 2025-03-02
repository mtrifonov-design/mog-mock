const subscribers = [];

let renderScript = "";
let pipeline = [];
let time = 0;


process.on('message', (msg) => {

    function emitUpdate() {
        subscribers.forEach(subscriber => {
            process.send({ target: subscriber, data: { renderScript } });
        });
    }   



    function compileRenderScript(state) {
        // generate pipeline steps
    
        renderScript = "";
        time = state.time;
        pipeline = state.layers[0].effects.map(effect => {
            return [effect.target, effect.payload];
        });

        if (pipeline.length !== 0) {
            const first = pipeline.shift();
            process.send({ target: first[0], data: { command: 'get', time, source: "render_engine", payload: first[1], renderScript } });
        }

    }

    if (msg.command === "effect_result") {
        renderScript = msg.renderScript;
        if (pipeline.length !== 0) {
            const next = pipeline.shift();
            process.send({ target: next[0], data: { command: 'get', source: "render_engine", time, payload: next[1], renderScript } });
        } else {
            emitUpdate();
        }
    }

    if (msg.command === "subscribe") {
        subscribers.push(msg.source);
    }

    if (msg.source === "docstate") {
        if (pipeline.length !== 0) {
            return; 
        }
        const state = msg.state;
        compileRenderScript(state);
    }

    if (msg.command === "get") {
        const target = msg.source;
        process.send({ target, data: { renderScript } });
    }



});
function init() {
    process.send({ target: 'docstate', data: { command: 'subscribe', source: "render_engine" } });
}
init();