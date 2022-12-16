import { Post } from './post';
import { User } from './user';

export interface Blog {
  posts: Post[];
  size: number;
  authors: User[];
  totalPostCount: number;
}
