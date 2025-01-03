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
