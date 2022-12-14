import { Frequency } from "./frequency";
import { Post } from "./post";

export interface UserStats {
  totalCount: number;
  averageLength: number;
  minLength: number;
  maxLength: number;  
  frequencies: Frequency[];
  longestPosts: Post[];
}