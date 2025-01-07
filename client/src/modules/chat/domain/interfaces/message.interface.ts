import { Author } from '@src/modules/chat/domain/enum/author.enum';

export interface IMessage {
  author: Author;
  content: string;
  timestamp: Date;
}
