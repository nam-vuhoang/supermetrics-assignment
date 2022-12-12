import { default as Pino } from 'pino';
import { env } from 'process';

export const logger = Pino({
  name: env.APP_NAME,
  level: 'debug',
});
