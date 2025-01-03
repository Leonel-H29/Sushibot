import path from 'path';
import dotenv from 'dotenv';
import { get } from 'lodash';

dotenv.config({
  path: path.resolve(__dirname, `../../.env`),
});

export const config = {
  environment: 'development',
  port: Number(get(process.env, 'PORT', 3000)),
  openai_key: get(process.env, 'OPENAI_API_KEY', ''),
  mongodb_url: get(process.env, 'MONGODB_URL', ''),
};
