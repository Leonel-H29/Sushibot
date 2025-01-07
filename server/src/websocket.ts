import WebSocket, { WebSocketServer } from 'ws';
import { ChatService } from '@src/modules/chat/application/services/chat.service';
import { Server } from 'http';

export class WebSocketConfig {
  private wss: WebSocketServer;

  constructor(httpServer: Server, private chatService: ChatService) {
    this.wss = new WebSocketServer({ server: httpServer });

    this.wss.on('connection', (ws: WebSocket) => {
      console.log('A user connected');

      ws.on('message', async (message: WebSocket.RawData) => {
        const messageString = message.toString();
        const response = await this.chatService.createChat(messageString);
        ws.send(JSON.stringify(response));
      });

      ws.on('close', () => {
        console.log('Client disconnected');
      });
    });
  }
}
