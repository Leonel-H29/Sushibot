import express from 'express';
import { config as ConfigApp } from '@src/config/config';
import { createServer } from 'http';
import { MongoDBClient } from '@src/clients/database/mongodb/mongodb_client';
import { WebSocketConfig } from '@src/websocket';
import { ChatService } from '@src/modules/chat/application/services/chat.service';
import { ChatRepository } from '@src/modules/chat/infrastructure/repositories/chat.repository';
import { OpenAIClient } from '@src/clients/openai/openai_client';

const app = express();

app.use(express.json());

const mongodbClient = new MongoDBClient();
mongodbClient.connect();

const httpServer = createServer(app);

const chatRepository = new ChatRepository();
const openaiClient = new OpenAIClient();
const chatService = new ChatService(chatRepository, openaiClient);

new WebSocketConfig(httpServer, chatService);

const PORT = ConfigApp.port;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
