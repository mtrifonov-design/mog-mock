const display = document.getElementById('display');

function init() {
    const message = { target: 'render_engine', data: { command: 'subscribe', source: "viewport" } }
    window.parent.postMessage(message, '*');
};

window.addEventListener('message', (event) => {
    console.log(event.data)
    if (event.data.target !== 'viewport') return;
    const obj = event.data;

    const evalString = `
    const display = document.getElementById('display');
    const ctx = display.getContext('2d');
    ctx.clearRect(0, 0, display.width, display.height);
    ${obj.data.renderScript}
    `
    eval(evalString);
    // display.innerText = obj.data.renderScript;
});

init();


