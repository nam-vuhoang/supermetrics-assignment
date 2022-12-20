import { environment } from '../../src/environment/environment';
import { Utils } from '../../src/utils/utils';
import { Post } from '../client/models/post';

export class PostGenerator {
  private static pages?: Post[][] = undefined;

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
              2020 + Utils.getRandomInt(3), // year
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
}
