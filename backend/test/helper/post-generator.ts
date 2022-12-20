import { start } from 'repl';
import { environment } from '../../src/environment/environment';
import { Utils } from '../../src/utils/utils';
import { Post } from '../client/models/post';

export class PostGenerator {
  private static pages?: Post[][] = undefined;
  private static sortedPages?: Post[][] = undefined;
  private static MILLISECONDS_PER_HOUR = 3600000;

  static generatePostPages(): Post[][] {
    if (!PostGenerator.pages) {
      const pageCount = environment.dataServer.pageCount;
      const pages: Post[][] = [];      

      for (let i = 0; i < pageCount; ++i) {
        const pageSize = Utils.getRandomInt(200);
        const posts: Post[] = [];
        for (let j = 0; j < pageSize; ++j) {
          const userId = Utils.getRandomInt(30).toString();
          const post: Post = {
            id: `pid_${Utils.getRandomInt(1000000).toString()}`,
            userId: `user_${userId}`,
            userName: `User ${userId}`,
            message: Utils.generateRandomId(30),
            type: 'status',
            createdTime: Date.UTC(
              2022 + Utils.getRandomInt(1), // year
              Utils.getRandomInt(12), // month
              Utils.getRandomInt(31) + 1, // date
              Utils.getRandomInt(24), // hour
              Utils.getRandomInt(60), // minutes
              Utils.getRandomInt(60) // seconds
            ),
          };

          posts.push(post);
        }

        pages.push(posts);
      }

      PostGenerator.pages = pages;
    }

    return PostGenerator.pages;
  }

  static generateSortedPostPages(): Post[][] {
    if (!PostGenerator.sortedPages) {
      const pageCount = environment.dataServer.pageCount;
      const pages: Post[][] = [];
      let createdTime = Date.UTC(
        2022 + Utils.getRandomInt(1), // year
        Utils.getRandomInt(12), // month
        Utils.getRandomInt(31) + 1, // date
        Utils.getRandomInt(24), // hour
        Utils.getRandomInt(60), // minutes
        Utils.getRandomInt(60) // seconds
      );

      for (let i = 0; i < pageCount; ++i) {
        const pageSize = Utils.getRandomInt(200);
        const posts: Post[] = [];
        for (let j = 0; j < pageSize; ++j) {
          const userId = Utils.getRandomInt(30).toString();
          const post: Post = {
            id: `pid_${Utils.getRandomInt(1000000).toString()}`,
            userId: `user_${userId}`,
            userName: `User ${userId}`,
            message: Utils.generateRandomId(30),
            type: 'status',
            createdTime,
          };

          createdTime -= Utils.getRandomInt(5 * 3600) * 1000; // max 5 hours earlier

          posts.push(post);
        }

        pages.push(posts);
      }

      PostGenerator.sortedPages = pages;
    }

    return PostGenerator.sortedPages;
  }

  static getPostByIndex(pages: Post[][], postIndex: number, userId?: string): Post | null {
    let index = postIndex;
    for (let i = 0; i < pages.length && index >= 0; ++i) {
      let page = pages[i];
      if (userId) {
        page = page.filter(p => p.userId === userId);
      }

      if (index <  page.length) {
        return page[index];
      }

      index -= page.length;
    }

    return null;
  }

  static getPostCount(pages: Post[][]): number {
    return Utils.getArraySum(pages.map((p) => p.length));
  }
}
