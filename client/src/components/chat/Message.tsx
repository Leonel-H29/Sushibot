import React from 'react';
import { IMessage } from '@src/modules/chat/domain/interfaces/message.interface';
import { Author } from '@src/modules/chat/domain/enum/author.enum';
import Markdown from 'react-markdown';

interface MessageProps {
  message: IMessage;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  const isClient = message.author === Author.CLIENT;
  const messageStyle = {
    textAlign: isClient
      ? 'left'
      : ('right' as React.CSSProperties['textAlign']),
    backgroundColor: isClient ? '#e5e5ea' : '#dcf8c6',
    padding: '0.625rem',
    borderRadius: '1.25rem',
    margin: '0.3125rem',
    display: 'block',
    maxWidth: '80%',
  };

  console.log('MESSAGE', message);
  return (
    <div
      style={messageStyle}
      className={isClient ? 'client-message' : 'assistant-message'}
    >
      <Markdown>{message.content}</Markdown>
      <span>{new Date(message.timestamp).toLocaleString()}</span>
    </div>
  );
};
