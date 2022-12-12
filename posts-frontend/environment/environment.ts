import { requireStringEnvParam } from '../utils/environment-utils';

export const environment = {
  appName: process.env.APP_NAME!, // requireStringEnvParam('APP_NAME'),
  backendUrl: process.env.BACKEND_URL!, // requireStringEnvParam('BACKEND_URL'),
};
