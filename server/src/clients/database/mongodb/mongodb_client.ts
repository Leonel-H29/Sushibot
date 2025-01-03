import mongoose from 'mongoose';
import { config } from '@src/config/config';

export class MongoDBClient {
  async connect(): Promise<void> {
    try {
      await mongoose.connect(config.mongodb_url);
    } catch (error) {
      console.error('Database connection failed:', error);
    }
  }
}
