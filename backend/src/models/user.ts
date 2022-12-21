import { UserStats } from './user-stats';

/**
 * user
 */
export interface User {
  /**
   * User ID
   */
  userId: string;

  /**
   * User name
   */
  userName: string;

  /**
   * User statistics. Defined as function for lazy load. Can be undefined.
   */
  stats?: () => UserStats;
}
