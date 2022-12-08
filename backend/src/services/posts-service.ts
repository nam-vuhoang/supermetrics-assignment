import { RESTDataSource } from '@apollo/datasource-rest';
import { KeyValueCache } from '@apollo/utils.keyvaluecache';
import { Post } from '../models/post';

interface RawPostData {
  page: number;
  posts: Array<Post>;
}

export class PostService extends RESTDataSource {
  private token: string;
  private pageCount: number;

  constructor(public baseURL: string, options: { token: string; cache: KeyValueCache; pageCount: number }) {
    super(options); // this sends our server's `cache` through
    this.memoizeGetRequests = true;

    this.token = options.token;
    this.pageCount = options.pageCount;
  }

  /**
   * Fetchs all posts of all users.
   * @returns
   */
  async fetchPosts(): Promise<Post[]> {
    return this.internalFetchPosts(this.fetchPostsByPage);
  }

  /**
   * Fetchs all
   * @param pageIndex
   * @returns
   */
  async fetchPostsByPage(pageIndex: number): Promise<Post[]> {
    const pageNumber = pageIndex + 1;
    return this.get<RawPostData>('posts', {
      params: {
        sl_token: this.token,
        pageIndex: pageNumber.toString(),
      },
    }).then((data) => {
      if (data.page !== pageNumber) {
        throw new Error(`Invalid data: expected page ${pageNumber}, but got page ${data.page}.`);
      }
      return data.posts;
    });
  }

  async fetchPostsByUser(userId: string): Promise<Post[]> {
    return this.internalFetchPosts((i) => this.internalFetchPostsByPageAndUser(i, userId));
  }

  private async internalFetchPostsByPageAndUser(pageIndex: number, userId: string): Promise<Post[]> {
    return this.fetchPostsByPage(pageIndex).then((posts) => posts.filter((p) => p.from_id === userId));
  }

  private async internalFetchPosts(getSinglePageFn: (pageIndex: number) => Promise<Post[]>) {
    const pageIndexes: number[] = Array.from(Array(this.pageCount).keys()); // from 0 to N-1;
    const pagePromises$: Promise<Post[]>[] = pageIndexes.map(getSinglePageFn);
    return Promise.all(pagePromises$).then((data) => data.flat());
  }
}
