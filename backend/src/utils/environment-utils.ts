import { env } from "process";

export class EnvironmentUtils {
  static requireStringEnvParam(name: string): string {
    if (env[name]) {
      return env[name];
    }
    throw new EvalError(`Environment param '${name}' is undefined.`);
  }
  
  static requireIntegerEnvParam(name: string): number  {
    const stringValue = EnvironmentUtils.requireStringEnvParam(name);
    const numberValue = Number(stringValue);
    if (Number.isInteger(numberValue)) {
      return numberValue;
    }

    throw new EvalError(`Environment param '${name}' must be an integer: '${stringValue}'.`);
  }
}

