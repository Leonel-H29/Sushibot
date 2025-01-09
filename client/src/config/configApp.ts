import { get } from 'lodash';

export const configApp = {
  serverApiUrl: get(process.env, 'SERVER_API_URL', 'ws://localhost:5000'),
};
