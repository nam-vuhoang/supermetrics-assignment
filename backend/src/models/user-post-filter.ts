import { PageFilter } from "./page-filter";

export interface UserPostFilter {
  userId?: string;
  page?: PageFilter;
  sortByCreatedTimeAsc?: boolean;
}