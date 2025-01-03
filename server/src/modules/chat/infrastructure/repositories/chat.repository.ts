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
