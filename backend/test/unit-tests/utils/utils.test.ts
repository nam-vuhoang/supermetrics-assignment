// import {sum} from './sum';

import { Utils } from '../../../src/utils/utils';

describe('sum module', () => {
  test('adds 1 + 2 to equal 3', () => {
    const array = [5, 6, 1, 3, -1].map((n) => ({
      n,
    }));
    expect(Utils.sortArray(array, (item) => item.n).map((item) => item.n)).toEqual([-1, 1, 3, 5, 6]);
  });
});
