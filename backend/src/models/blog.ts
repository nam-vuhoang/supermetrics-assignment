import { Utils } from '../utils/utils';
import { Post } from './post';
import { User } from './user';
import { UserStats } from './user-stats';

/**
 * A collection of Post
 */
export class Blog {
  /**
   * 
   * @param posts Blog posts
   * @param totalPostCount Total post count (including posts in other pages)
   */
  constructor(public posts: Post[], public totalPostCount: number) {}

  /**
   * Number of posts in the blog
   */
  get size(): number {
    return this.posts.length;
  }

  /**
   * Authors of posts in the blog
   */
  get authors(): User[] {
    const userMap = new Map<string, User>();

    for (let post of this.posts) {
      const { userId, userName } = post;
      if (!userMap.has(userId)) {
        userMap.set(userId, {
          userId,
          userName,
          stats: () => this.getUserStats(userId),
        });
      }
    }

    return Array.from(userMap.values());
  }

  /**
   * Get user statistics based on the posts in the blog
   * @param userId 
   * @returns 
   */
  getUserStats(userId: string): UserStats {
    let totalCount = 0;
    let minLength: number | undefined = undefined;
    let maxLength: number = 0;
    let totalLength = 0;
    let frequencies = [];

    for (let post of this.posts) {
      if (post.userId === userId) {
        totalCount += 1;
        const { length } = post.message;
        minLength = minLength === undefined ? length : Math.min(minLength, length);
        maxLength = Math.max(maxLength, length);
        totalLength += length;

        const { createdTime } = post;
        const createdMonth = new Date(createdTime.getUTCFullYear(), createdTime.getUTCMonth());
        const frequency = frequencies.find((f) => f.month.getTime() === createdMonth.getTime());

        if (frequency) {
          frequency.count += 1;
        } else {
          frequencies.push({ month: createdMonth, count: 1 });
        }
      }
    }

    return {
      totalCount: totalCount,
      minLength: minLength || 0,
      averageLength: Math.round(totalLength / totalCount),
      maxLength,
      frequencies: Utils.sortArray(frequencies, (f) => f.month.getTime()),
      longestPosts: () => this.posts.filter((p) => p.userId === userId && p.message.length === maxLength),
    };
  }
}
