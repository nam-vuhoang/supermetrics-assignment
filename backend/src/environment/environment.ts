import dotenv from 'dotenv';
import { requireIntEnvParam, requireStringEnvParam } from '../utils/environment-utils';

function loadConfig() {
  dotenv.config();
  return {
    graphqlServer: {
      port: requireIntEnvParam('PORT'),
    },
    dataServer: {
      baseUrl: requireStringEnvParam('DATA_SERVER_BASE_URL'),
      clientInfo: {
        client_id: requireStringEnvParam('DATA_SERVER_CLIENT_ID'),
        email: requireStringEnvParam('DATA_SERVER_CLIENT_EMAIL'),
        name: requireStringEnvParam('DATA_SERVER_CLIENT_NAME'),
      },
      pageCount: requireIntEnvParam('DATA_POSTS_MAX_PAGE_COUNT'),
    },
  };
}

export const environment = loadConfig();
