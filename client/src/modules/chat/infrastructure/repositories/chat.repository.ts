import { ChatService } from '@src/modules/chat/application/services/chat.service';
import { IMessage } from '@src/modules/chat/domain/interfaces/message.interface';

export default class ChatRepository {
  private chatService: ChatService;

  constructor(chatService: ChatService) {
    this.chatService = chatService;
  }

  public sendMessage(message: string): void {
    this.chatService.sendMessage(message);
  }

  public onMessageReceived(callback: (message: IMessage) => void): void {
    this.chatService.onMessage(callback);
  }
}
