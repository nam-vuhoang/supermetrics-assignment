import { default as Pino } from 'pino';

export const logger = Pino({
  name: process.env.APP_NAME,
  level: 'debug',
});

