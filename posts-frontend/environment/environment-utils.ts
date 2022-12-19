/**
 * Utils for validating environment params.
 */
export class EnvironmentUtils {

  /**
   * Vaidate if a value is a valid string (not undefined, null or '').
   * If no then throw an EvalError.
   * @param name 
   * @param value 
   * @returns 
   */
  static requireStringEnvParam(name: string, value?: string): string {
    if (value) {
      return value;
    }
    throw new EvalError(
      `Environment param '${name}' is undefined.`
    );
  }

  /**
   * Vaidate if a value is a valid integer.
   * If no then throw an EvalError.
   * @param name 
   * @param value 
   * @returns 
   */
  static requireIntegerEnvParam(name: string, value?: string): number {
    const numberValue = Number(
      EnvironmentUtils.requireStringEnvParam(name, value)
    );
    if (Number.isInteger(numberValue)) {
      return numberValue;
    }
    throw new EvalError(`Environment param '${name}' must be integer.`);
  }
}
