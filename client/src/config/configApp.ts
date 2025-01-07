import { get } from 'lodash';

export const configApp = {
  serverApiUrl: get(process.env, 'SERVER_API_URL', ''),
  port: Number(get(process.env, 'PORT', 3200)),
};
