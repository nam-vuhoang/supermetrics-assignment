export function requireStringEnvParam(name: string, value?: string): string {
  if (value) {
    return value;
  }
  throw new EvalError(`Environment variable '${name}' is undefined (${process.env[name]}).`);
}

export function requireIntEnvParam(name: string, value?: string): number {
  const numberValue = Number(requireStringEnvParam(name, value));
  if (Number.isInteger(numberValue)) {
    return numberValue;
  }
  throw new EvalError(`Environment variable '${name}' must be integer.`);
}
