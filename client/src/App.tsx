import { useSendMessage } from '@src/modules/chat/application/use-cases/useSendMessage';
import { useReceiveMessage } from '@src/modules/chat/application/use-cases/useReceiveMessage';
import { ChatService } from '@src/modules/chat/application/services/chat.service';
import { ChatWindow } from '@src/components/chat/ChatWindow';
import { ChatInput } from '@src/components/chat/ChatInput';
import { configApp } from '@src/config/configApp';

function App() {
  const chatService = new ChatService(configApp.serverApiUrl);
  const sendMessage = useSendMessage(chatService);
  const messages = useReceiveMessage(chatService);

  return (
    <>
      <ChatWindow messages={messages} />
      <ChatInput onSendMessage={sendMessage} />
    </>
  );
}

export default App;
