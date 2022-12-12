import { env } from "process";

export const ENVIRONMENT_FILE_PATH = 'env/configuration.env';

export function requireStringEnvParam(name: string): string {
  if (env[name]) {
    return env[name];
  }
  throw new EvalError(`Param '${name}' in configuration file '${ENVIRONMENT_FILE_PATH}' is undefined .`);
}

export function requireIntEnvParam(name: string): number  {
  const floatValue = Number(requireStringEnvParam(name));
  if (isNaN(floatValue)) {
    throw new EvalError(`Param '${name}' in configuration file '${ENVIRONMENT_FILE_PATH}' must be integer.`);
  }  
  
  const intValue = Math.floor(floatValue);
  if (floatValue == intValue) {
    return intValue;
  }
  throw new EvalError(`Param '${name}' in configuration file '${ENVIRONMENT_FILE_PATH}' must be integer.`);
}
