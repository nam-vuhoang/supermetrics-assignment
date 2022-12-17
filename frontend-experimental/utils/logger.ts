import { default as Pino } from 'pino';
import { environment } from '../environment/environment';

export const logger = Pino({
  name: environment.appName,
  level: 'debug',
});

