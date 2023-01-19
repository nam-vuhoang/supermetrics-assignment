import { Frequency } from './frequency';
import { Post } from './post';

/**
 * User statistics
 */
export interface UserStats {
  /**
   * User post count
   */
  totalCount: number;

  /**
   * Average post length
   */
  averageLength: number;

  /**
   * Median post length
   */
  medianLength: number;

  /**
   * Min post length
   */
  minLength: number;

  /**
   * Max post length
   */
  maxLength: number;

  /**
   * Frequencies by month
   */
  frequencies: Frequency[];

  /**
   * Longest posts (lazy load)
   * @returns 
   */
  longestPosts: () => Post[];
}
