import moment, { Moment } from 'moment';
import { Utils } from './utils';

export class MomentUtils {
  /**
   * Creates a sorted array with all 1st days of each months of every specified items.
   * For example: [7/6/2022, 14/2/2023] => [1/6/2022, 1/7/2022, ..., 1/2/2023].
   * @param momentValues 
   * @returns 
   */
  static createMonthlyArrayFromNumberArray(momentValues: number[]): Moment[] {
    const firstMoment = moment.utc(Utils.getArrayMin(momentValues));
    if (!firstMoment.isValid) {
      throw new EvalError('firstMoment is invalid date');
    }

    const lastMoment = moment.utc(Utils.getArrayMax(momentValues));
    if (!lastMoment.isValid) {
      throw new EvalError('lastMoment is invalid date');
    }

    const firstMonth = moment.utc(new Date(Date.UTC(firstMoment.year(), firstMoment.month())));

    const months: Moment[] = [];
    for (
      let month = firstMonth;
      !month.isAfter(lastMoment);
      month.add(1, 'month')
    ) {
      months.push(month.clone());
    }

    return months;
  }

    /**
   * Creates a sorted array with all 1st days of each months of every specified items.
   * For example: [7/6/2022, 14/2/2023] => [1/6/2022, 1/7/2022, ..., 1/2/2023].
   * @param momentValues 
   * @returns 
   */
    static createMonthlyArrayFromMomentArray(moments: Moment[]): Moment[] {
      return MomentUtils.createMonthlyArrayFromNumberArray(moments.map(m => m.valueOf()));
    }
  
}
