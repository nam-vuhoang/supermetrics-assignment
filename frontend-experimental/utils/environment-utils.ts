export function requireStringEnvParam(name: string, value?: string): string {
  if (value) {
    return value;
  }
  throw new EvalError(`Environment variable '${name}' is undefined (${process.env[name]}).`);
}

export function requireIntEnvParam(name: string, value?: string): number {
  const floatValue = Number(requireStringEnvParam(name, value));
  if (isNaN(floatValue)) {
    throw new EvalError(`Environment variable '${name}' must be integer.`);
  }

  const intValue = Math.floor(floatValue);
  if (floatValue == intValue) {
    return intValue;
  }
  throw new EvalError(`Environment variable '${name}' must be integer.`);
}
