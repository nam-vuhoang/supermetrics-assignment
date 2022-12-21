import { PageFilter } from './page-filter';

/**
 * Blog filter.
 */
export interface BlogFilter {
  /**
   * User ID filter. Optional.
   */
  userId?: string;

  /**
   * Page filter. Optional.
   */
  page?: PageFilter;

  /**
   * Flag indicatiing whether to sort blog posts by created time in a ASC order (if true), or DESC order (if false or undefined).
   * Defaults to false when page filter in defined.
   */
  sortByCreatedTimeAsc?: boolean;
}
