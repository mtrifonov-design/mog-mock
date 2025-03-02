

const timeline = document.getElementById('timeline');

timeline.addEventListener('input', async () => {
    const value = timeline.value;
    const message = { target: 'docstate', data: { command: 'timeline', value } }
    window.parent.postMessage(message, '*');
});


