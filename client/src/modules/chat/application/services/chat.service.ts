import { IMessage } from '@src/modules/chat/domain/interfaces/message.interface';

export class ChatService {
  private socket: WebSocket;

  constructor(url: string) {
    this.socket = new WebSocket(url);
  }

  sendMessage(message: string) {
    this.socket.send(message);
  }

  onMessage(callback: (message: IMessage) => void) {
    this.socket.onmessage = (event) => {
      const message: IMessage = JSON.parse(event.data);
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
