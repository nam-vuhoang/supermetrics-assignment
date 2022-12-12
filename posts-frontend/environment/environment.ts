import dotenv from 'dotenv';
import {
  ENVIRONMENT_FILE_PATH,
  requireStringEnvParam,
} from '../utils/environment-utils';

function loadConfig() {
  dotenv.config({ path: ENVIRONMENT_FILE_PATH });
  return {
    backendUrl: requireStringEnvParam('BACKEND_URL'),
  };
}

export const environment = loadConfig();
