import { Utils } from '../utils/utils';
import { PageFilter } from './page-filter';
import { Post } from './post';
import { User } from './user';
import { UserStats } from './user-stats';

/**
 * A collection of Post
 */
export class Blog {
  /**
   * Create a PostCollection, sort and paginate if needed.
   * @param originalPosts
   * @param pageFilter
   * @param sortByCreatedTimeAsc
   * @returns
   */
  static createBlog(originalPosts: Post[], pageFilter?: PageFilter, sortByCreatedTimeAsc?: boolean): Blog {
    const totalPostCount = originalPosts.length;

    // should sort when either page filter or sort order is defined
    if (pageFilter || sortByCreatedTimeAsc !== undefined) {
      // reverse order if sortByCreatedTimeAsc is undefined or false
      originalPosts = Utils.sortArray(originalPosts, (p) => p.createdTime.getTime(), !sortByCreatedTimeAsc);
    }

    if (pageFilter) {
      const start = pageFilter.size * pageFilter.index;
      const end = pageFilter.size * (pageFilter.index + 1);
      originalPosts = originalPosts.slice(start, end);
    }

    return new Blog(originalPosts, totalPostCount);
  }

  /**
   *
   * @param posts Blog posts
   * @param totalPostCount Total post count (including posts in other pages)
   */
  constructor(public posts: Post[], public totalPostCount: number) {}

  /**
   * Number of posts in the blog. Defined as a function for lazy loading.
   */
  get size(): number {
    return this.posts.length;
  }

  /**
   * Authors of posts in the blog. Defined as a function for lazy loading.
   */
  authors(): User[] {
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
  private getUserStats(userId: string): UserStats {
    const userPosts = Utils.sortArray(
      this.posts.filter((p) => p.userId === userId),
      (p) => p.message.length
    );

    let frequencies = [];
    let totalLength = 0;

    userPosts.forEach(({ message, createdTime }) => {
      totalLength += message.length;

      const createdMonth = Utils.getMonthUTC(createdTime);
      const frequency = frequencies.find((f) => f.month.getTime() === createdMonth.getTime());

      if (frequency) {
        frequency.count += 1;
      } else {
        frequencies.push({ month: createdMonth, count: 1 });
      }
    });

    const totalCount = userPosts.length;
    const maxLength = userPosts[totalCount - 1]?.message.length || 0;

    return {
      totalCount,
      minLength: userPosts[0]?.message.length || 0,
      maxLength,
      averageLength: Math.round(totalLength / totalCount),
      medianLength: Math.round(Utils.getArrayMedian(userPosts.map((p) => p.message.length))),
      frequencies: Utils.sortArray(frequencies, (f) => f.month.getTime()),
      longestPosts: () => userPosts.filter((p) => p.message.length === maxLength),
    };
  }
}
