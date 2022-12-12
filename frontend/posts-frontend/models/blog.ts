import { sortArray } from '../utils/utils';
import { Post } from './post';
import { UserStats } from './user-stats';

export interface Blog {
  posts: Post[];
  size: number;
  stats: UserStats[];
}
