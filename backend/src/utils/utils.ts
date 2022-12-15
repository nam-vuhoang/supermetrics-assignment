import { stringify } from 'querystring';
import { arrayBuffer } from 'stream/consumers';

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
   * Sum array values
   * @param items 
   * @param valueGetter 
   * @returns 
   */
  static sumArrayValues<T>(
    items: Array<T> | null,
    valueGetter: (item: T) => number
  ): number {
    return items.reduce((accumulator, item) => {
      return accumulator + valueGetter(item);
    }, 0);
  }

  /**
   * Create number range from 0 to N-1.
   * @param n
   */
  static createNumberRange(n: number): number[] {
    return Array.from(Array(n).keys());
  }
}
