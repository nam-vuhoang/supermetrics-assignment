export function compare<T>(
  a: T,
  b: T,
  getField: (item: T) => string | number,
  reverse: boolean = false
): number {
  return reverse
    ? getField(a) < getField(b)
      ? 1
      : getField(a) > getField(b)
        ? -1
        : 0
    : getField(a) < getField(b)
      ? -1
      : getField(a) > getField(b)
        ? 1
        : 0;
}

export function compareFn<T>(
  getField: (item: T) => string | number,
  reverse: boolean = false
): (a: T, b: T) => number {
  return (a, b) => compare(a, b, getField, reverse);
}

export function sortArray<T>(
  items: Array<T> | null,
  getField: (item: T) => string | number,
  reverse: boolean = false
): Array<T> {
  return items?.sort(compareFn(getField, reverse)) || [];
}
