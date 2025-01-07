import React from 'react';
import { Message } from '@src/components/chat/Message';
import { IMessage } from '@src/modules/chat/domain/interfaces/message.interface';
import { Container } from 'react-bootstrap';

interface ChatWindowProps {
  messages: IMessage[];
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  return (
    <Container>
      {messages.map((message, index) => (
        <Message key={index} message={message} />
      ))}
    </Container>
  );
};
