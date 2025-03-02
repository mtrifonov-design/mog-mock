
const p = document.getElementById('state-display');

function init() {
    const message = { target: 'docstate', data: { command: 'get', source: "docstate-viewer" } }
    window.parent.postMessage(message, '*');

    const message2 = { target: 'docstate', data: { command: 'subscribe', source: "docstate-viewer" } }
    window.parent.postMessage(message2, '*');
}


window.addEventListener('message', (event) => {
    console.log(event.data)
    if (event.data.target !== 'docstate-viewer') return;
    const obj = event.data;
    p.innerText = JSON.stringify(obj.data.state, null, 2);
});

init();
