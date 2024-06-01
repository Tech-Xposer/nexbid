import http from "http";
import dotenv from "dotenv";
import app from "./app.js";
import connection from "./config/db.js";
import { wss } from "./websocket.js";

dotenv.config();

const PORT = process.env.PORT || 3000;


connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1); 
  } else {
    console.log('Connected to MySQL');
  }
});

const server = http.createServer(app);

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
