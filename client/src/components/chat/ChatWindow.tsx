import React, { useEffect, useRef } from 'react';
import { Message } from '@src/components/chat/Message';
import { IMessage } from '@src/modules/chat/domain/interfaces/message.interface';
import { Container } from 'react-bootstrap';

interface ChatWindowProps {
  messages: IMessage[];
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Container
      style={{ marginBottom: '6.25rem', overflowY: 'auto', maxHeight: '80vh' }}
    >
      {messages.map((message, index) => (
        <Message key={index} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </Container>
  );
};
