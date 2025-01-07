import React, { useState } from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <InputGroup className="fixed-bottom mb-3">
      <FormControl
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <>
        <Button variant="primary" onClick={handleSend}>
          Send
        </Button>
      </>
    </InputGroup>
  );
};
