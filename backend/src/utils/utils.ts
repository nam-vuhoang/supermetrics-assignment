export class Utils {
  /**
   * Get field values of the two objects and compare them.
   * @param a
   * @param b
   * @param valueGetter
   * @param reverse
   * @returns
   */
  static compare<T>(a: T, b: T, valueGetter: (item: T) => string | number, reverse: boolean = false): number {
    const valueA = valueGetter(a);
    const valueB = valueGetter(b);
    if (reverse) {
      return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
    }
    return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
  }

  /**
   * Get field values of the two objects and compare them.
   * @param valueGetter
   * @param reverse
   * @returns
   */
  static compareFn<T>(valueGetter: (item: T) => string | number, reverse: boolean = false): (a: T, b: T) => number {
    return (a, b) => Utils.compare(a, b, valueGetter, reverse);
  }

  /**
   * Sort array by specified item value field.
   * @param items
   * @param valueGetter
   * @param reverse
   * @returns
   */
  static sortArray<T>(
    items: Array<T> | null,
    valueGetter: (item: T) => string | number,
    reverse: boolean = false
  ): Array<T> {
    return items?.sort(Utils.compareFn(valueGetter, reverse)) || [];
  }

  /**
   * Create number range from 0 to N-1.
   * @param n
   */
  static createNumberRange(n: number): number[] {
    return Array.from(Array(n).keys());
  }

  /**
   * Sum array values.
   * @param items
   * @returns
   */
  static getArraySum(items: Array<number>): number {
    return items.reduce((accumulator, item) => {
      return accumulator + item;
    }, 0);
  }

  /**
   * Get array min value.
   * @param items
   * @returns
   */
  static getArrayMin(items: Array<number>): number {
    return Math.min.apply(null, items);
  }

  /**
   * Get array max value.
   * @param items
   * @returns
   */
  static getArrayMax(items: Array<number>): number {
    return Math.max.apply(null, items);
  }

  /**
   * Get random integer between 0 (inclusive) and limit (exclusive).
   * @param limit
   * @returns
   */
  static getRandomInt(limit: number) {
    return Math.floor(Math.random() * limit);
  }

  static generateRandomId(length: number): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Utils.getRandomInt(charactersLength));
    }
    return result;
  }

  /**
   * Get first day of month in UTC time zone.
   * @param date
   */
  static getMonthUTC(date: Date): Date {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth()));
  }
}
