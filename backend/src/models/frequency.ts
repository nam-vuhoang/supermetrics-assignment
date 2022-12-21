/**
 * Posting frequency of user.
 */
export interface Frequency {
  /**
   * The first day of month.
   */
  month: Date;

  /**
   * The post count in the month.
   */
  count: number;
}