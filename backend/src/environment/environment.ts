import dotenv from 'dotenv';
import { EnvironmentUtils } from '../utils/environment-utils';

/**
 * Load .env files and build a environment configuration object.
 */
function loadConfig() {
  dotenv.config();
  return {
    graphqlServer: {
      port: EnvironmentUtils.requireIntegerEnvParam('PORT'),
    },
    dataServer: {
      useMock: EnvironmentUtils.requireBooleanEnvParam('DATA_SERVER_USE_MOCK'), 
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

/**
 * Environment configuration params.
 */
export const environment = loadConfig();
