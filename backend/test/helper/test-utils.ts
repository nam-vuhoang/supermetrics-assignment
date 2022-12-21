export interface TestType<T> {
  value: T;
}

/**
 * Create a wrapper instance for a value.
 * @param value 
 * @returns 
 */
export function wrapper<T>(value: T): TestType<T> {
  return { value };
}

/**
 * Get a value from wrapped instance.
 * @param value 
 * @returns 
 */
export function getterValue<T>(t: TestType<T>): T {
  return t.value;
}

/**
 * Set testing timer.
 */
export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
