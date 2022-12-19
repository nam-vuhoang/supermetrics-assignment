export class EnvironmentUtils {
  static requireStringEnvParam(name: string, value?: string): string {
    if (value) {
      return value;
    }
    throw new EvalError(
      `Environment param '${name}' is undefined.`
    );
  }

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
