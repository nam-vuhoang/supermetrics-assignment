import moment, { Moment, MomentInput } from 'moment';

export class MomentUtils {
  static createMonthArray(momentValues: number[]): Moment[] {
    const firstMoment = moment(Math.min.apply(null, momentValues));
    if (!firstMoment.isValid) {
      throw new EvalError('firstMoment is invalid date');
    }

    const lastMoment = moment(Math.max.apply(null, momentValues));
    if (!lastMoment.isValid) {
      throw new EvalError('lastMoment is invalid date');
    }

    const months: Moment[] = [];
    for (
      let month = firstMoment;
      !month.isAfter(lastMoment);
      month.add(1, 'month')
    ) {
      months.push(month.clone());
    }

    return months;
  }
}
