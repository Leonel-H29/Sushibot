import React from 'react';
import { IMessage } from '@src/modules/chat/domain/interfaces/message.interface';

interface MessageProps {
  message: IMessage;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  return (
    <div
      className={
        message.author === 'client' ? 'client-message' : 'assistant-message'
      }
    >
      <p>{message.content}</p>
      <span>{message.timestamp.toLocaleTimeString()}</span>
    </div>
  );
};
