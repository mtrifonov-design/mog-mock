const subscribers = [];

const state = {
    time: 0,
    layers: [
        {
            id: "layer1",
            effects: [
                {
                    target: "fx_circle",
                    payload: {
                        radius: 50,
                        fill: "#00ff00"
                    }
                },
                {
                    target: "fx_blur",
                    payload: {
                        amount: 20
                    }
                }
            ]
        }
    ]
}

process.on('message', (msg) => {

    function emitUpdate() {
        subscribers.forEach(subscriber => {
            process.send({ target: subscriber, data: { state, source: "docstate" } });
        });
    }   

    console.log(`[Text Provider] Received request:`, msg);

    if (msg.command === "subscribe") {
        subscribers.push(msg.source);
    }

    if (msg.command === "timeline") {
        const value = msg.value;
        state.time = value;
        emitUpdate();
    }

    if (msg.command === "get") {
        const target = msg.source;
        process.send({ target, data: { state, source: "docstate" } });
    }

});
