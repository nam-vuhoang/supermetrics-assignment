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
    const paramValue = 'foo';
    process.env[paramName] = paramValue;
    const e = expect(() => EnvironmentUtils.requireIntegerEnvParam(paramName));
    e.toThrow(EvalError);
    e.toThrow(`Environment param '${paramName}' must be an integer: '${paramValue}'.`);
    process.env[paramName] = undefined;
  });
});
