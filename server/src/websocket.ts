import { Server as WebSocketServer } from 'socket.io';
import { ChatService } from '@src/modules/chat/application/services/chat.service';
import { Server } from 'http';

export class WebSocket {
  private io: WebSocketServer;

  constructor(httpServer: Server, private chatService: ChatService) {
    this.io = new WebSocketServer(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    this.io.on('connection', (socket) => {
      console.log(`A user connected: ${socket.id}`);

      socket.on('message', async (message: string) => {
        const response = await this.chatService.createChat(message);
        socket.emit('message', response);
      });
    });
  }
}
