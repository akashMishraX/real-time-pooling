// express hhtps app
import express from 'express';
require('dotenv').config();
const app = express();
import { resolve } from 'path';
const port = process.env.PORT || 3000;

app
    .get('/', (req, res, next) => {
            res.sendFile(resolve(__dirname, '../client/index.html'));
    })
    .use(express.static('src/client/public'))



const httpServer = app.listen(port);

// websocket server
import { WebSocketServer , WebSocket} from 'ws';
import { websocketError } from './handleError';
const wsServer = new WebSocketServer({ noServer: true });    

// Upgrade to websocket
httpServer.on('upgrade',(req,socket,head)=>{
    socket.on('error',()=> new websocketError('socket pre-upgrade-error', 500));

    wsServer.handleUpgrade(req, socket, head, (ws) => {
        socket.removeListener('error', ()=> new websocketError('socket premature-error', 500));
        wsServer.emit('connection', ws, req);
    });
})

//websocket server
wsServer.on('connection',(ws,req)=>{
    ws.on('error',()=> new websocketError('websocket post-upgrade-error', 500));

    ws.on('open',()=>{
        console.log('Websocket connection opened');
    })

    ws.on('message',(msg)=>{
        wsServer.clients.forEach((client)=>{
            if (ws !== client && client.readyState === WebSocket.OPEN) {
                client.send(msg.toLocaleString());
            }
        })
    })
    
    ws.on('close',()=>{
        console.log('Websocket connection closed');
    })
})