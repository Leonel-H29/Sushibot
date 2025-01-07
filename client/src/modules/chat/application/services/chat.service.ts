import { IMessage } from '@src/modules/chat/domain/interfaces/message.interface';
import { configApp } from '@src/config/configApp';
//import { Author } from '@src/modules/chat/domain/enum/author.enum';

export class ChatService {
  private socket: WebSocket;

  constructor() {
    this.socket = new WebSocket(configApp.serverApiUrl);
  }

  sendMessage(message: string) {
    this.socket.send(message);
  }

  onMessage(callback: (message: IMessage) => void) {
    this.socket.onmessage = (event) => {
      let message: IMessage = JSON.parse(event.data);
      console.log(message);
      if (!message.timestamp) {
        message = {
          ...message,
          timestamp: new Date(),
        };
      }
      callback(message);
    };
  }
  onClose(callback: () => void): void {
    this.socket.onclose = callback;
  }

  onError(callback: (event: Event) => void): void {
    this.socket.onerror = callback;
  }
}
