export class Utils {
  static compare<T>(
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
  
  static compareFn<T>(
    getField: (item: T) => string | number,
    reverse: boolean = false
  ): (a: T, b: T) => number {
    return (a, b) => Utils.compare(a, b, getField, reverse);
  }
  
  
  static sortArray<T>(
    items: Array<T> | null,
    getField: (item: T) => string | number,
    reverse: boolean = false
  ): Array<T> {
    return items?.sort(Utils.compareFn(getField, reverse)) || [];
  }
  
  /**
   * Return number range from 0 to N-1
   * @param n
   */
  static createNumberRange(n: number): number[] {
    return Array.from(Array(n).keys());
  }
}
