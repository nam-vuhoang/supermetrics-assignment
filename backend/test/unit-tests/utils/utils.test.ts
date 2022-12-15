// import {sum} from './sum';

import { Utils } from '../../../src/utils/utils';
import { wrapper, getterValue } from '../../helper/test-utils';

describe('test Utils', () => {
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

  test('create number arrage', () => {
    expect(Utils.createNumberRange(5)).toEqual([0, 1, 2, 3, 4]);
    expect(Utils.createNumberRange(0)).toEqual([]);
  });

  test('sum array', () => {
    const items = Utils.createNumberRange(10); // 0, 1, 2, ...
    let sum = 0;
    for (let item of items) {
      sum += item;
    }

    expect(Utils.sumArrayValues(items.map(wrapper), getterValue)).toBe(sum);
  });
});
