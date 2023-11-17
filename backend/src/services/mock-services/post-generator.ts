import { environment } from '../../environment/environment';
import { Utils } from '../../utils/utils';
import { Post } from '../../../test/client/models/post';

/**
 * Responsible for generating post pages for testing.
 */
export class PostGenerator {
  private static pages?: Post[][] = undefined;
  private static sortedPages?: Post[][] = undefined;

  /**
   * Generating post pages for testing with variable amount of posts per page.
   */
  static generatePostPages(): Post[][] {
    if (!this.pages) {
      const pageCount = environment.dataServer.pageCount;
      const pages: Post[][] = [];

      for (let i = 0; i < pageCount; ++i) {
        const pageSize = Utils.getRandomInt(200);
        const posts: Post[] = [];
        for (let j = 0; j < pageSize; ++j) {
          const userId = this.getRandomUserId();
          const post: Post = {
            id: `pid_${Utils.getRandomInt(1000000).toString()}`,
            userId: `user_${userId}`,
            userName: `User ${userId}`,
            message: this.getRandomMessage(),
            type: 'status',
            createdTime: this.getRandomTimeAgo().getTime(),
          };

          posts.push(post);
        }

        pages.push(posts);
      }

      this.pages = pages;
    }

    return this.pages;
  }

  /**
   * Generating sorted pages (with decreasing time) for testing with variable amount of posts per page.
   */
  static generateSortedPostPages(): Post[][] {
    if (!this.sortedPages) {
      const pageCount = environment.dataServer.pageCount;
      const pages: Post[][] = [];
      let createdTime = new Date().getTime();

      for (let i = 0; i < pageCount; ++i) {
        const pageSize = Utils.getRandomInt(200);
        const posts: Post[] = [];
        for (let j = 0; j < pageSize; ++j) {
          createdTime -= Utils.getRandomInt(5 * 3600) * 1000; // max 5 hours earlier

          const userId = this.getRandomUserId();
          const post: Post = {
            id: `pid_${Utils.getRandomInt(1000000).toString()}`,
            userId: `user_${userId}`,
            userName: `User ${userId}`,
            message: this.getRandomMessage(),
            type: 'status',
            createdTime,
          };

          posts.push(post);
        }

        pages.push(posts);
      }

      this.sortedPages = pages;
    }

    return this.sortedPages;
  }

  static getPostByIndex(pages: Post[][], postIndex: number, userId?: string): Post | null {
    let index = postIndex;
    for (let i = 0; i < pages.length && index >= 0; ++i) {
      let page = pages[i];
      if (userId) {
        page = page.filter((p) => p.userId === userId);
      }

      if (index < page.length) {
        return page[index];
      }

      index -= page.length;
    }

    return null;
  }

  static getPostCount(pages: Post[][]): number {
    return Utils.getArraySum(pages.map((p) => p.length));
  }

  private static getRandomUserId(): string {
    const userId = Utils.getRandomInt(30) + 1;
    return userId.toLocaleString('en-US', { minimumIntegerDigits: 2 });
  }

  private static getRandomTimeAgo(): Date {
    const now = new Date().getTime();
    const ago = Utils.getRandomInt(365 * 24 * 3600 * 1000);
    return new Date(now - ago);
  }

  private static getRandomMessage(): string {
    let message = '';
    for (let i = Utils.getRandomInt(30); i >= 0; i--) {
      const wordLength = Utils.getRandomInt(10) + 1;
      message += Utils.generateRandomId(wordLength) + ' ';
    }
    return message;
  }
}
