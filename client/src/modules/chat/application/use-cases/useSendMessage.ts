import { ChatService } from '@src/modules/chat/application/services/chat.service';

export const useSendMessage = (chatService: ChatService) => {
  return (message: string) => {
    chatService.sendMessage(message);
  };
};
