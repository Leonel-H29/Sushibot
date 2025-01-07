import React from 'react';
import { Message } from '@src/components/chat/Message';
import { IMessage } from '@src/modules/chat/domain/interfaces/message.interface';

interface ChatWindowProps {
  messages: IMessage[];
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  return (
    <div>
      {messages.map((message, index) => (
        <Message key={index} message={message} />
      ))}
    </div>
  );
};
