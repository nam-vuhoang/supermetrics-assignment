import { env } from "process";

export class EnvironmentUtils {
  static requireStringEnvParam(name: string): string {
    if (env[name]) {
      return env[name];
    }
    throw new EvalError(`Environment param '${name}' is undefined.`);
  }
  
  static requireIntegerEnvParam(name: string): number  {
    const floatValue = Number(EnvironmentUtils.requireStringEnvParam(name));
    if (isNaN(floatValue)) {
      throw new EvalError(`Environment param '${name}' must be integer.`);
    }  
    
    const intValue = Math.floor(floatValue);
    if (floatValue == intValue) {
      return intValue;
    }
    throw new EvalError(`Environment param '${name}' must be integer.`);
  }
}

