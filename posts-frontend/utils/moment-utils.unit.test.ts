import exp from 'constants';
import moment, { Moment } from 'moment';
import { MomentUtils } from './moment-utils';
import { Utils } from './utils';

describe('Test MomentUtils', () => {
  test('', () => {
    for (let n = 0; n < 10; ++n) {
      // any day from 1/1/1970 until now
      const firstDate = moment.utc(Utils.getRandomInt(moment.now()));

      const dates = [firstDate.clone()];

      let date = firstDate;

      const size = n === 0 ? 0 : Utils.getRandomInt(30) + 1;

      for (let i = 0; i < size; ++i) {
        date.add(Utils.getRandomInt(30), 'days');
        date.add(Utils.getRandomInt(24), 'hours');
        date.add(Utils.getRandomInt(60), 'minutes');
        date.add(Utils.getRandomInt(60), 'seconds');
        dates.push(date.clone());
      }

      // console.log(dates);

      const lastDate = date;

      const monthlyArray: Moment[] = MomentUtils.createMonthlyArrayFromMomentArray(dates);
      // console.log(monthlyArray);

      expect(monthlyArray.length).toBeGreaterThan(0);

      let yearNumber = dates[0].year();
      let monthNumber = dates[0].month();

      // console.log(yearNumber, monthNumber);

      for (let i = 0; i < monthlyArray.length; ++i) {
        const month = monthlyArray[i];
        // console.log(month, yearNumber, monthNumber);
        expect(month.year()).toBe(yearNumber);
        expect(month.month()).toBe(monthNumber);
        expect(month.date()).toBe(1);
        expect(month.hours()).toBe(0);
        expect(month.minutes()).toBe(0);
        expect(month.seconds()).toBe(0);
        expect(month.milliseconds()).toBe(0);

        monthNumber += 1;
        if (monthNumber === 12) {
          monthNumber = 0;
          yearNumber += 1;
        }
      }

      const lastMonth = monthlyArray[monthlyArray.length - 1];
      expect(lastMonth.year()).toBe(lastDate.year());
      expect(lastMonth.month()).toBe(lastDate.month());
    }
  });
});
