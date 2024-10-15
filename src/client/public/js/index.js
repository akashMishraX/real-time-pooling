(function () {
    let ws = null;
    const openEl = document.getElementById('ws-open');
    const closeEl = document.getElementById('ws-close');
    const inputEl = document.getElementById('ws-input');
    const sendEl = document.getElementById('ws-send');
    const responseEl = document.getElementById('ws-response');

    function showMessage(message) {
        const newMessage = document.createElement('p');
        newMessage.textContent = message;
        responseEl.appendChild(newMessage);
        responseEl.scrollTop = responseEl.scrollHeight;
    }
    function removeConnection() {
        if(ws){
            ws.close();
            ws = null;
        }
    }

    openEl.addEventListener('click', () => {
        removeConnection()
        ws = new WebSocket('ws://localhost:3000');

        ws.addEventListener('open', () => {
            showMessage('--------Connection established------------');
        });

        ws.addEventListener('close', () => {
            showMessage('--------Connection closed------------');

        });
        ws.addEventListener('message', (event) => {
            showMessage(`Message received:-${event.data}`);
        });

    })

    closeEl.addEventListener('click', removeConnection)   


    sendEl.addEventListener('click', (e) => {
        const message = inputEl.value;
        if(!message){return alert('Enter a message')}
        if(!ws){
            showMessage(`--------No Connection Found------------`);
        }
        ws.send(message);
        showMessage(`Message sent:- ${message}`);
        inputEl.value = '';
    })
})()