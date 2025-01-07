import { Author } from '@src/modules/chat/domain/enum/author.enum';

export interface Response {
  author: Author;
  content: string;
  timestamp: Date;
}
