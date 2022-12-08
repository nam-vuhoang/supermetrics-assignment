import { RESTDataSource } from '@apollo/datasource-rest';
import { KeyValueCache } from '@apollo/utils.keyvaluecache';
import { GraphQLContext } from '../graphql/graphql-context';
import { UserPost } from '../models/user-post';
import { HttpResponse } from '../models/http-response';
import { logger } from '../utils/logger';

interface RawPostData {
  page: number;
  posts: Array<UserPost>;
}

export class UserPostService extends RESTDataSource {
  static readonly REQUEST_PATH = 'posts';

  private context: GraphQLContext;
  private pageCount: number;

  constructor(context: GraphQLContext, public baseURL: string, pageCount: number) {
    super(context); // this sends our server's `cache` through
    this.memoizeGetRequests = true;
    this.context = context;
    this.pageCount = pageCount;
  }

  /**
   * Fetchs all posts of all users.
   * @returns
   */
  async fetchPosts(): Promise<UserPost[]> {
    return this.internalFetchPosts(this.fetchPostsByPage);
  }

  /**
   * Fetchs all
   * @param pageIndex
   * @returns
   */
  async fetchPostsByPage(pageIndex: number): Promise<UserPost[]> {
    const pageNumber = pageIndex + 1;
    const token = await this.getToken({ forceRefresh: false });

    logger.info('Fetching posts from page %d', pageNumber);
    return this.get<HttpResponse<RawPostData>>(UserPostService.REQUEST_PATH, {
      params: {
        sl_token: token,
        page: pageNumber.toString(),
      },
    })
      .then((response) => response.data)
      .then((data) => {
        logger.info('Loaded page: %d (size: %d)', data.page, data.posts.length);
        if (data.page !== pageNumber) {
          throw new Error(`Invalid data: expected page ${pageNumber}, but got page ${data.page}.`);
        }
        return data.posts;
      })
      .finally(() => logger.info('Fetching posts completed'));
  }

  async fetchPostsByUser(userId: string): Promise<UserPost[]> {
    return this.internalFetchPosts((i) => this.internalFetchPostsByPageAndUser(i, userId));
  }

  private async internalFetchPostsByPageAndUser(pageIndex: number, userId: string): Promise<UserPost[]> {
    return this.fetchPostsByPage(pageIndex).then((posts) => posts.filter((p) => p.from_id === userId));
  }

  private async internalFetchPosts(getSinglePageFn: (pageIndex: number) => Promise<UserPost[]>) {
    const pageIndexes: number[] = Array.from(Array(this.pageCount).keys()); // from 0 to N-1;
    const pagePromises$: Promise<UserPost[]>[] = pageIndexes.map(getSinglePageFn);
    return Promise.all(pagePromises$).then((data) => data.flat());
  }

  private async getToken(options: { forceRefresh: boolean }): Promise<string> {
    return options.forceRefresh
      ? this.context.authenticationService.forceRefreshToken()
      : this.context.authenticationService.getToken();
  }
}
