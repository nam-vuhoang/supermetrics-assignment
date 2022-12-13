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

export function getArrayMin(items: Array<number>) {
  return Math.min.apply(null, items);
}

export function getArrayMax(items: Array<number>) {
  return Math.max.apply(null, items);
}
