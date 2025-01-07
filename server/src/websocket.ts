import WebSocket, { WebSocketServer } from 'ws';
import { ChatService } from '@src/modules/chat/application/services/chat.service';
import { Server } from 'http';
import { Response } from '@src/modules/chat/domain/interfaces/response.interface';
import { Author } from '@src/modules/chat/domain/enum/author.enum';

export class WebSocketConfig {
  private wss: WebSocketServer;

  constructor(httpServer: Server, private chatService: ChatService) {
    this.wss = new WebSocketServer({ server: httpServer });

    this.wss.on('connection', (ws: WebSocket) => {
      console.log('A user connected');

      ws.on('message', async (message: WebSocket.RawData) => {
        const messageString = message.toString();

        const userRequest: Response = {
          author: Author.CLIENT,
          content: messageString,
          timestamp: new Date(),
        };

        ws.send(JSON.stringify(userRequest));

        const response = await this.chatService.createChat(messageString);

        console.log(JSON.stringify(response));

        const agentResponse: Response = {
          author: Author.ASSISTANT,
          content: response,
          timestamp: new Date(),
        };
        ws.send(JSON.stringify(agentResponse));
      });

      ws.on('close', () => {
        console.log('Client disconnected');
      });
    });
  }
}
