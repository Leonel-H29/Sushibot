import { Chat } from '@src/modules/chat/domain/interfaces/chat.interface';

export interface IChatRepository {
  create(chat: Chat): Promise<Chat>;
}
