import dotenv from 'dotenv';
import { EnvironmentUtils } from '../utils/environment-utils';

function loadConfig() {
  dotenv.config();
  return {
    graphqlServer: {
      port: EnvironmentUtils.requireIntegerEnvParam('PORT'),
    },
    dataServer: {
      baseUrl: EnvironmentUtils.requireStringEnvParam('DATA_SERVER_BASE_URL'),
      clientInfo: {
        client_id: EnvironmentUtils.requireStringEnvParam('DATA_SERVER_CLIENT_ID'),
        email: EnvironmentUtils.requireStringEnvParam('DATA_SERVER_CLIENT_EMAIL'),
        name: EnvironmentUtils.requireStringEnvParam('DATA_SERVER_CLIENT_NAME'),
      },
      pageCount: EnvironmentUtils.requireIntegerEnvParam('DATA_POSTS_MAX_PAGE_COUNT'),
    },
  };
}

export const environment = loadConfig();
