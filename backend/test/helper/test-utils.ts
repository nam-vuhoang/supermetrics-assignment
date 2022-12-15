export interface TestType<T> {
  value: T;
}

export function wrapper<T>(value: T): TestType<T> {
  return { value };
}

export function getterValue<T>(t: TestType<T>): T {
  return t.value;
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
