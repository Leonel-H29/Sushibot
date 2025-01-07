import { useSendMessage } from '@src/modules/chat/application/use-cases/useSendMessage';
import { useReceiveMessage } from '@src/modules/chat/application/use-cases/useReceiveMessage';
import { ChatService } from '@src/modules/chat/application/services/chat.service';
import { ChatWindow } from '@src/components/chat/ChatWindow';
import { ChatInput } from '@src/components/chat/ChatInput';
import { Card } from 'react-bootstrap';

function App() {
  const chatService = new ChatService();
  const sendMessage = useSendMessage(chatService);
  const messages = useReceiveMessage(chatService);

  return (
    <>
      <Card style={{ position: 'relative', height: '100vh' }}>
        <Card.Header>
          <img
            src="/avatar.webp"
            alt="Avatar del Bot"
            style={{ width: '2rem', height: '2rem', marginRight: '0.5rem' }}
          />
          Chatbot
        </Card.Header>
        <Card.Body style={{ overflowY: 'auto' }}>
          <ChatWindow messages={messages} />
        </Card.Body>
        <Card.Footer
          className="text-muted"
          style={{ position: 'absolute', bottom: 0, width: '100%' }}
        >
          <ChatInput onSendMessage={sendMessage} />
        </Card.Footer>
      </Card>
    </>
  );
}

export default App;
