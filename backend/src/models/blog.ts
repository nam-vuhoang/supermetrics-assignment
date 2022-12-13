import { sortArray } from '../utils/utils';
import { Post } from './post';
import { UserStats } from './user-stats';

export class Blog {
  constructor(public posts: Post[]) {}

  get size(): number {
    return this.posts.length;
  }

  get stats(): UserStats[] {
    const userStatsMap = new Map<string, UserStats>();

    for (let post of this.posts) {
      let userStats = userStatsMap.get(post.userId);
      if (!userStats) {
        userStats = {
          userId: post.userId,
          userName: post.userName,
          totalCount: 0,
          averageLength: 0,
          minLength: 0,
          maxLength: 0,
          frequencies: [],
        };
        userStatsMap.set(userStats.userId, userStats);
      }

      userStats.totalCount += 1;
      const { length } = post.message;
      userStats.minLength = userStats.minLength === 0 ? length : Math.min(userStats.minLength, length);
      userStats.maxLength = Math.max(userStats.maxLength, length);
      userStats.averageLength += length;

      const { createdTime } = post;
      const createdMonth = new Date(createdTime.getUTCFullYear(), createdTime.getUTCMonth());

      let frequency = userStats.frequencies.find((f) => f.month.getTime() === createdMonth.getTime());
      if (frequency) {
        frequency.count += 1;
      } else {
        userStats.frequencies.push({ month: createdMonth, count: 1 });
      }
    }

    return Array.from(userStatsMap.values()).map((stats) => {
      stats.averageLength = Math.round(stats.averageLength / stats.totalCount);
      sortArray(stats.frequencies, (f) => f.month.getTime());
      return stats;
    });
  }

  get longestPost(): Post | null {
    let maxLength = 0;
    let longestPost: Post | null = null;
    for (let post of this.posts) {
      const length = post.message.length;
      if (maxLength < length) {
        maxLength = length;
        longestPost = post;
      }
    }

    return longestPost;
  }
}
