import { UserStats } from './user-stats';

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
   * User statistics
   */
  stats: UserStats;
}
