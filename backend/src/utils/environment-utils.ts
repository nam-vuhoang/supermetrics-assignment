import { env } from 'process';

/**
 * Validator for environment params.
 */
export class EnvironmentUtils {
  /**
   * Check if a environment param is undefined. If no, then throw an EvalError.
   * @param name
   * @returns
   */
  static requireStringEnvParam(name: string): string {
    if (env[name]) {
      return env[name];
    }
    throw new EvalError(`Environment param '${name}' is undefined.`);
  }

  /**
   * Check if a environment param is integer. If no, then throw EvalError.
   * @param name
   * @returns
   */
  static requireIntegerEnvParam(name: string): number {
    const stringValue = EnvironmentUtils.requireStringEnvParam(name);
    const numberValue = Number(stringValue);
    if (Number.isInteger(numberValue)) {
      return numberValue;
    }

    throw new EvalError(`Environment param '${name}' must be an integer: '${stringValue}'.`);
  }

  /**
   * Check if a environment param is undefined. If no, then throw an EvalError.
   * @param name
   * @returns
   */
  static requireBooleanEnvParam(name: string): boolean {
    const stringValue = EnvironmentUtils.requireStringEnvParam(name);
    return Boolean(stringValue);
  }
}
