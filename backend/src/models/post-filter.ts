import { PageFilter } from "./page-filter";

export interface PostFilter {
  userId?: string;
  page?: PageFilter;
  sortByCreatedTimeAsc?: boolean;
}