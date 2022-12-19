// import {sum} from './sum';

import { Utils } from './utils';
import { wrapper, getterValue } from '../test/helper/test-utils';

describe('test sorting utils', () => {
  test('sort number array  in ASC/DESC orders', () => {
    const array = [5, 6, 1, 3, -1].map(wrapper);
    expect(Utils.sortArray([...array], getterValue).map(getterValue)).toEqual([-1, 1, 3, 5, 6]);
    expect(Utils.sortArray([...array], getterValue, true).map(getterValue)).toEqual([6, 5, 3, 1, -1]);
  });

  test('sort string array in ASC/DESC order', () => {
    const array = ['abc', 'ABC', 'DEF', 'efg'].map(wrapper);
    expect(Utils.sortArray([...array], getterValue).map(getterValue)).toEqual(['ABC', 'DEF', 'abc', 'efg']);
    expect(Utils.sortArray([...array], getterValue, true).map(getterValue)).toEqual(['efg', 'abc', 'DEF', 'ABC']);
  });
});

describe('test number utils', () => {
  const size = 10;
  let items: number[] = [];
  const noItems: number[] = [];

  beforeAll(() => {
    const limit = 100000;
    for (let i = 0; i < size; ++i) {
      items.push((Math.random() - 0.5) * 2 * limit);
    }
  });

  test('sum array', () => {
    let sum = 0;
    for (let item of items) {
      sum += item;
    }

    expect(Utils.getArraySum(items)).toBe(sum);
    expect(Utils.getArraySum(noItems)).toBe(0);
  });

  test('sum empty array', () => {
    expect(Utils.getArraySum(noItems)).toBe(0);
  });

  test('min array', () => {
    let min: number = Number.POSITIVE_INFINITY;
    for (let item of items) {
      min = Math.min(min, item);
    }

    expect(Utils.getArrayMin(items)).toBeCloseTo(min);
  });

  test('min empty array', () => {
    expect(Utils.getArrayMin(noItems)).toBe(Number.POSITIVE_INFINITY);
  });

  test('max array', () => {
    let max: number = Number.NEGATIVE_INFINITY;
    for (let item of items) {
      max = Math.max(max, item);
    }

    expect(Utils.getArrayMax(items)).toBeCloseTo(max);
  });

  test('max empty array', () => {
    expect(Utils.getArrayMax(noItems)).toBe(Number.NEGATIVE_INFINITY);
  });

  test('create number arrage', () => {
    expect(Utils.createNumberRange(5)).toEqual([0, 1, 2, 3, 4]);
  });

  test('create empty number arrage', () => {
    expect(Utils.createNumberRange(0)).toEqual([]);
  });

  test('get random integer', () => {
    const limit = 1000000;
    for (let i = 0; i < 100; ++i) {
      const random = Utils.getRandomInt(limit);
      expect(Number.isInteger(random)).toBe(true);
      expect(random).toBeGreaterThanOrEqual(0);
      expect(random).toBeLessThan(limit);
    }
  });
});

describe('test date utils', () => {
  test('getMonthUTC', () => {
    for (let i = 0; i < 100; ++i) {
      const expectedYear = Utils.getRandomInt(60) + 1970;
      const expectedMonth = Utils.getRandomInt(12);
      const date = new Date(
        Date.UTC(
          expectedYear,
          expectedMonth,
          Utils.getRandomInt(28) + 1, // February has only 28 days
          Utils.getRandomInt(24),
          Utils.getRandomInt(60),
          Utils.getRandomInt(60)
        )
      );

      const actualDate = Utils.getMonthUTC(date);
      const expectedValue = Date.UTC(expectedYear, expectedMonth);

      // console.log('original: ', date, ' actual: ', actualDate, 'expected: ', new Date(expectedValue));
      expect(actualDate.valueOf()).toEqual(expectedValue);
    }
  });
});

describe('compare utils', () => {
  test('compareFn/compare for number', () => {
    const limit = 1000000;
    for (let i = 0; i < 100; ++i) {
      const a = (Math.random() - 0.5) * limit;
      const b = (Math.random() - 0.5) * limit;
      const result = a < b ? -1 : a > b ? 1 : 0;

      const aObj = wrapper(a);
      const bObj = wrapper(b);

      expect(Utils.compare(aObj, bObj, getterValue<number>)).toBe(result);
      expect(Utils.compareFn(getterValue<number>)(aObj, bObj)).toBe(result);

      expect(Utils.compare(aObj, bObj, getterValue<number>, true)).toBe(-result);
      expect(Utils.compareFn(getterValue<number>, true)(aObj, bObj)).toBe(-result);
    }
  });
});