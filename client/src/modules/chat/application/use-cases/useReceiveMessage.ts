import { useEffect, useState } from 'react';
import { ChatService } from '@src/modules/chat/application/services/chat.service';
import { IMessage } from '@src/modules/chat/domain/interfaces/message.interface';
export const useReceiveMessage = (chatService: ChatService) => {
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    chatService.onMessage((message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  }, [chatService]);

  return messages;
};
