import { EnvironmentUtils } from './environment-utils';

describe('Environment-utils methods', () => {
  test('Required and existing string', () => {
    expect(EnvironmentUtils.requireStringEnvParam('APP_NAME'));
  });

  test('Required and existing integer', () => {
    expect(EnvironmentUtils.requireIntegerEnvParam('PORT'));
  });

  test('Required and not existing string', () => {
    const paramName = 'FOO_BAR';
    const e = expect(() => EnvironmentUtils.requireStringEnvParam(paramName));
    e.toThrow(EvalError);
    e.toThrow(`Environment param '${paramName}' is undefined.`);
  });

  test('Required and not existing integer', () => {
    const paramName = 'FOO_BAR';
    const e = expect(() => EnvironmentUtils.requireIntegerEnvParam(paramName));
    e.toThrow(EvalError);
    e.toThrow(`Environment param '${paramName}' is undefined.`);
  });

  test('Required and invalid integer', () => {
    const paramName = 'FOO_BAR';
    process.env[paramName] = 'foo';
    const e = expect(() => EnvironmentUtils.requireIntegerEnvParam(paramName));
    e.toThrow(EvalError);
    e.toThrow(`Environment param '${paramName}' must be integer.`);
    process.env[paramName] = undefined;
  });
});
