const display = document.getElementById('display');

function init() {
    const message = { target: 'render_engine', data: { command: 'subscribe', source: "text-viewport" } }
    window.parent.postMessage(message, '*');
};

window.addEventListener('message', (event) => {
    console.log(event.data)
    if (event.data.target !== 'text-viewport') return;
    const obj = event.data;
    display.innerText = obj.data.renderScript;
});

init();


