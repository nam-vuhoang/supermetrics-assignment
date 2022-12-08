import dotenv from 'dotenv';
import { env, exit } from 'process';
import { logger } from '../utils/logger';

const configurationFilePath = 'env/configuration.env';

function requireConfigParam(name: string) {
  if (!env[name]) {
    logger.error(`Param '${name}' is undefined in the configuration file '${configurationFilePath}'.`);
    logger.info('Application is exiting...');
    exit();
  }
}

function loadConfig() {
  dotenv.config({ path: configurationFilePath });
  requireConfigParam('PORT');
  requireConfigParam('DATA_SERVER_BASE_URL');
  requireConfigParam('DATA_SERVER_CLIENT_ID');
  requireConfigParam('DATA_SERVER_CLIENT_EMAIL');
  requireConfigParam('DATA_SERVER_CLIENT_NAME');
  requireConfigParam('DATA_POSTS_MAX_PAGE_COUNT');

  return {
    graphqlServer: {
      port: parseInt(env.PORT!),
    },
    dataServer: {
      baseUrl: env.DATA_SERVER_BASE_URL!,
      clientInfo: {
        client_id: env.DATA_SERVER_CLIENT_ID!,
        email: env.DATA_SERVER_CLIENT_EMAIL!,
        name: env.DATA_SERVER_CLIENT_NAME!,
      },
      pageCount: parseInt(env.DATA_POSTS_MAX_PAGE_COUNT!),
    },
  };
}

export const environment = loadConfig();
