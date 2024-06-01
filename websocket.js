import { WebSocketServer } from 'ws'
const wss = new WebSocketServer({noServer:true})
wss.on('connection', (ws, req) => {
  ws.on('message', (message) => {
    const parsedMessage = JSON.parse(message);

    switch (parsedMessage.type) {
      case 'bid':
        handleBid(ws, parsedMessage);
        break;
      case 'notify':
        handleNotify(ws, parsedMessage);
        break;
      default:
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid message type' }));
    }
  });
});

function handleBid(ws, message) {
  const { itemId, bidAmount, userId } = message;
  const newBid = { itemId, bidAmount, userId, createdAt: new Date() };

  wss.clients.forEach((client) => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'update', newBid }));
    }
  });
}

function handleNotify(ws, message) {
  const { userId, notification } = message;

  wss.clients.forEach((client) => {
    if (client.userId === userId && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'notify', notification }));
    }
  });
}

export { wss };
