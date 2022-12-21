import { logger } from './logger';

/**
 * Tests global logger.
 */
describe('Test logger', () => {
  test('logger level in JEST environment', () => {
    expect(logger).toBeDefined();
    // Check the logger level which is set in file /test/setup.ts
    expect(logger.level).toBe('warn');
  });
});
