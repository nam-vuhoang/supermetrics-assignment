import { EnvironmentUtils } from './environment-utils';

//
// [IMPORTANT] Process environment variables cannot be inlined via dynamic lookups!!!
// See more https://nextjs.org/docs/basic-features/environment-variables
//
describe('Environment-utils methods', () => {
  test('Required and existing string', () => {
    expect(
      EnvironmentUtils.requireStringEnvParam(
        'NEXT_PUBLIC_BACKEND_URL',
        process.env.NEXT_PUBLIC_BACKEND_URL
      )
    );
  });

  // test('Required and existing integer', () => {
  //   expect(EnvironmentUtils.requireIntegerEnvParam('PORT'));
  // });

  test('Required and not existing string', () => {
    const paramName = 'FOO_BAR';
    const e = expect(() =>
      EnvironmentUtils.requireStringEnvParam(paramName, process.env.FOO_BAR)
    );
    e.toThrow(EvalError);
    e.toThrow(`Environment param '${paramName}' is undefined.`);
  });

  test('Required and not existing integer', () => {
    const paramName = 'FOO_BAR';
    const e = expect(() =>
      EnvironmentUtils.requireIntegerEnvParam(paramName, process.env.FOO_BAR)
    );
    e.toThrow(EvalError);
    e.toThrow(`Environment param '${paramName}' is undefined.`);
  });

  test('Required and invalid integer', () => {
    const paramName = 'FOO_BAR';
    const paramValue = 'foo';
    process.env[paramName] = paramValue;
    const e = expect(() =>
      EnvironmentUtils.requireIntegerEnvParam(paramName, process.env.FOO_BAR)
    );
    e.toThrow(EvalError);
    e.toThrow(
      `Environment param '${paramName}' must be an integer: ${paramValue}.`
    );
    process.env[paramName] = undefined;
  });
});
