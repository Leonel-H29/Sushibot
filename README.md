# Sushibot

### Introduction to the Sushi Ordering Chatbot Project

This project involves the development of an interactive chatbot designed to make it easier for customers to order sushi through a friendly and efficient interface. The chatbot is equipped to display the day's menu, take orders, and answer frequently asked questions such as business hours and menu details.

The chatbot's back-end is built with Node.js, leveraging the capabilities of JavaScript on the server to handle user interactions asynchronously. Data persistence, such as products and orders, is managed through MongoDB, a NoSQL database that offers flexibility and straightforward integration with Node.js.

For the user interface, React is used, a JavaScript framework for building user interfaces with reusable and reactive components. This allows for a smooth and dynamic user experience, where orders and interactions are updated in real-time.

### Server (Express + Typescript + MongoDB)

#### Environment Variables

Before running the server project, ensure the following environment variables are set:

- `PORT`: The port number where the server will listen.
- `OPENAI_API_KEY`: Your API key for OpenAI services.
- `MONGODB_URL`: Your MongoDB connection string.

#### Installation

Navigate to the server directory and install dependencies:

```bash
npm install
```

#### Running the Project

Start the server with:

```bash
npm run dev
```

The server will be accessible at `http://localhost:<PORT>`.

#### MongoDB Connection

Set the `MONGODB_URL` environment variable with your MongoDB connection string. The server uses Mongoose for MongoDB interactions, as seen in the `MongoDBClient` class (startLine: 1, endLine: 12).

For detailed MongoDB setup instructions, refer to the [official MongoDB documentation](https://www.mongodb.com/docs/manual/).

### Client (React + Vite.js + Typescript)

#### Environment Variables

The client project requires the `SERVER_API_URL` environment variable to connect to the server via WebSocket.

#### Installation

Navigate to the client directory and install dependencies:

```bash
npm install
```

#### Running the Project

Start the client with:

```bash
npm run dev
```

The client will be accessible at `http://localhost:5173`.

![Captura desde 2025-01-09 17-13-59](https://github.com/user-attachments/assets/4999dd2c-ad42-4715-9364-1fc31272d46c)


#### MongoDB Connection

The client interacts with the server via WebSocket, which handles MongoDB operations.

For MongoDB setup, refer to the [official MongoDB documentation](https://www.mongodb.com/docs/manual/).


# Project Functionality Explanation

## Client-Side Message Sending

On the client side, the user interacts with a React-based interface to send messages. When a user types a message into the chat input and submits it, the `useSendMessage` hook is invoked, which in turn calls the `sendMessage` function from the `ChatService`.


```1:36:client/src/App.tsx
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
```


The `sendMessage` function establishes a WebSocket connection to the server and sends the message as a string. The WebSocket protocol is used here for real-time, bidirectional communication between the client and the server.

## Server-Side Message Reception and Response Generation

Upon receiving a message from the client, the server-side WebSocket configuration handles the incoming data. The message is then passed to the `ChatService`, which uses the `OpenAIClient` to generate a response.


```1:44:server/src/websocket.ts
import WebSocket, { WebSocketServer } from 'ws';
import { ChatService } from '@src/modules/chat/application/services/chat.service';
import { Server } from 'http';
import { Response } from '@src/modules/chat/domain/interfaces/response.interface';
import { Author } from '@src/modules/chat/domain/enum/author.enum';

export class WebSocketConfig {
  private wss: WebSocketServer;

  constructor(httpServer: Server, private chatService: ChatService) {
    this.wss = new WebSocketServer({ server: httpServer });

    this.wss.on('connection', (ws: WebSocket) => {
      console.log('A user connected');

      ws.on('message', async (message: WebSocket.RawData) => {
        const messageString = message.toString();

        const userRequest: Response = {
          author: Author.CLIENT,
          content: messageString,
          timestamp: new Date(),
        };

        ws.send(JSON.stringify(userRequest));

        const response = await this.chatService.createChat(messageString);

        console.log(JSON.stringify(response));

        const agentResponse: Response = {
          author: Author.ASSISTANT,
          content: response,
          timestamp: new Date(),
        };
        ws.send(JSON.stringify(agentResponse));
      });

      ws.on('close', () => {
        console.log('Client disconnected');
      });
    });
  }
}
```


The `OpenAIClient` sends the message to the OpenAI API, which processes the text and returns a response based on the assistant's capabilities defined in the `assistanceRestaurantPrompt`.


```1:38:server/src/clients/openai/openai_client.ts
import { config } from '@src/config/config';
import OpenAI from 'openai';
import { assistanceRestaurantPrompt } from '@src/clients/openai/prompts/assistanceRestaurant.prompt.openai';
import { isEmpty } from 'lodash';

export class OpenAIClient {
  private readonly client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: config.openai_key,
    });
  }

  async createChatCompletion(message: string): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: assistanceRestaurantPrompt,
          },
          { role: 'user', content: message },
        ],
      });

      const chosenMessage = response.choices[0].message.content;

      return isEmpty(chosenMessage)
        ? "I'm sorry, I couldn't understand your request.."
        : String(chosenMessage);
    } catch (error) {
      console.error('Error handling client message:', error);
      return "I'm sorry, I couldn't process your request.";
    }
  }
}
```


## AI Agent Message Support

The AI agent, powered by OpenAI, supports a variety of messages, including inquiries about the menu, orders, and general questions. The prompt provided to the AI models the behavior of a helpful assistant for a Japanese restaurant, guiding the AI's responses.


```1:85:server/src/clients/openai/prompts/assistanceRestaurant.prompt.openai.ts
import { getCurrentTime } from '@src/utils/getCurrentTime';

export const assistanceRestaurantPrompt: string = `
You are a helpful assistant for a Japanese restaurant. Answer customer inquiries about the menu, orders, and general questions. 
Please respond in the same language the customer uses.

**Assistant Prompt:**

---

**Welcome Message:**
Hello! Welcome to our Japanese restaurant. How can I assist you today? If you have any questions about the menu, sushi options, drinks, desserts, or anything related to our orders, I am here to help.

---

**Daily Menu:**

---

**Sushis of the Day:**
1. **Salmon Sushi (4 pieces)** - *Delicious fresh salmon on sushi rice, with a touch of wasabi and soy sauce.*  
   Price: $8.99

2. **Tuna Sushi (4 pieces)** - *High-quality fresh tuna served on sushi rice with a hint of olive oil and a pinch of salt.*  
   Price: $9.99

3. **California Roll (8 pieces)** - *Sushi roll with avocado, cucumber, crab, and Japanese mayonnaise.*  
   Price: $7.50

4. **Tempura Roll (8 pieces)** - *Roll filled with tempura shrimp, avocado, and cucumber, topped with a crispy tempura layer.*  
   Price: $10.50

5. **Shrimp Nigiri (2 pieces)** - *Fresh shrimp on sushi rice, served with a drizzle of teriyaki sauce.*  
   Price: $6.99

6. **Vegetarian Sushi (4 pieces)** - *A combination of avocado, cucumber, carrot, and bell pepper on sushi rice.*  
   Price: $6.00

---

**Drinks:**
- **Japanese Green Tea** (Iced or Hot) - *Traditional Japanese green tea with antioxidant properties.*  
  Price: $2.50

- **Japanese Ramune Soda** (Lemon, Grape, Strawberry) - *Refreshing fruit-flavored drink.*  
  Price: $3.00

- **Mineral Water** - *Bottle of fresh water.*  
  Price: $1.50

---

**Japanese Desserts:**
1. **Green Tea Mochi** - *Delicious rice balls filled with green tea ice cream.*  
   Price: $4.00

2. **Dorayaki** - *Sweet pancakes filled with red bean paste, soft and fluffy.*  
   Price: $3.50

3. **Japanese Cheesecake** - *Soft and light Japanese-style cheesecake.*  
   Price: $5.50

4. **Matcha Tart** - *Delicious tart with matcha cream and a crispy base.*  
   Price: $4.50

---

**Opening Hours:**
- We are open every day from **10:00 am to 10:00 pm**.  
- The current local time is: ${getCurrentTime()}
- If your message is sent outside of this time, we will happily respond the next day during our business hours.

---

**If the customer messages outside of business hours:**

- *Sorry, our business hours are from 10:00 am to 10:00 pm. How else can I assist you within this time frame?*

---

**If the assistant doesn't know the answer to a customer's question:**

- *Unfortunately, I don’t have the answer to your question right now. But I’d be happy to help with any other inquiries related to our menu or service. How can I assist you further?*

`;
```


The AI can respond to questions about availability, menu items, pricing, and can also handle requests outside of business hours or questions it does not know the answer to.

## Server-Side Message Storage in the Database

After generating the response, the `ChatService` creates a `Chat` object containing both the client's message and the assistant's response. This object is then stored in MongoDB using the `ChatRepository`, which interacts with the `ChatModel` schema to save the conversation to the database.


```1:23:server/src/modules/chat/application/services/chat.service.ts
import { OpenAIClient } from '@src/clients/openai/openai_client';
import { IChatRepository } from '@src/modules/chat/domain/repositories/chat.repository';
import { Chat } from 'src/modules/chat/domain/interfaces/chat.interface';

export class ChatService {
  constructor(
    private readonly chatRepository: IChatRepository,
    private openaiClient: OpenAIClient
  ) {}

  async createChat(message: string): Promise<string> {
    const response = await this.openaiClient.createChatCompletion(message);

    const newChat: Chat = {
      client: message,
      assistant: response,
    };

    await this.chatRepository.create(newChat);

    return response;
  }
}
```



```1:11:server/src/modules/chat/infrastructure/repositories/chat.repository.ts
import { IChatRepository } from '@src/modules/chat/domain/repositories/chat.repository';
import { Chat } from '@src/modules/chat/domain/interfaces/chat.interface';
import { ChatModel } from '@src/clients/database/mongodb/models/chat.model';

export class ChatRepository implements IChatRepository {
  async create(chat: Chat): Promise<Chat> {
    const chatLog = new ChatModel(chat);
    await chatLog.save();
    return chatLog.toObject();
  }
}
```


The `ChatModel` defines the structure of the stored messages, including the client's message, the assistant's response, and the timestamp.


```1:9:server/src/clients/database/mongodb/models/chat.model.ts
import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  client: { type: String, required: true },
  assistant: { type: String, required: true },
  time: { type: Date, default: Date.now },
});

export const ChatModel = mongoose.model('Chat', chatSchema);
```


## Client-Side Reception and Display of Messages

Back on the client side, messages are received through the WebSocket connection. The `useReceiveMessage` hook listens for messages from the server and updates the chat window with both the user's and the assistant's messages.


```1:36:client/src/App.tsx
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
```


The `ChatWindow` component takes the array of message objects and renders them in the UI, providing a real-time chat experience.

In summary, the client sends messages to the server via WebSocket, the server processes these messages with the help of OpenAI, stores the conversation in MongoDB, and sends the response back to the client, which displays the ongoing conversation. The data types involved in this process include strings for the messages and JSON objects for the structured data, such as the chat messages with their associated metadata.
