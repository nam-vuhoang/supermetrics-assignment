import { Frequency } from './frequency';
import { Post } from './post';

export interface UserStats {
  totalCount: number;
  averageLength: number;
  medianLength: number;
  minLength: number;
  maxLength: number;
  frequencies: Frequency[];
  longestPosts: Post[];
}
