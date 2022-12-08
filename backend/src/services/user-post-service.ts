import { RESTDataSource } from '@apollo/datasource-rest';
import { KeyValueCache } from '@apollo/utils.keyvaluecache';
import { ApolloServerErrorCode } from '@apollo/server/errors';

import { GraphQLContext } from '../graphql/graphql-context';
import { UserPost } from '../models/user-post';
import { HttpResponse } from '../models/http-response';
import { logger } from '../utils/logger';
import { GraphQLError } from 'graphql';
import { log } from 'console';
import { StatusCodes } from 'http-status-codes';
import { UserStats } from '../models/user-stats';

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
    return this.fetchPostsAndMerge(this.fetchPostsByPage);
  }

  /**
   * Fetchs all
   * @param pageIndex
   * @returns
   */
  async fetchPostsByPage(pageIndex: number, retryIfUnauthorized: boolean = true): Promise<UserPost[]> {
    if (pageIndex < 0 || pageIndex >= this.pageCount) {
      throw new GraphQLError('Invalid argument value', {
        extensions: {
          code: 'BAD_USER_INPUT',
          argumentName: 'pageIndex',
        },
      });
    }

    const pageNumber = pageIndex + 1;
    logger.info('Fetching posts from page %d', pageNumber);

    const token = retryIfUnauthorized
      ? await this.context.authenticationService.getToken()
      : await this.context.authenticationService.forceRefreshToken();

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
          throw new GraphQLError(`Invalid data: expected page ${pageNumber}, but got page ${data.page}.`, {
            extensions: {
              code: 'DATA_SERVER_ERROR',
              argumentName: 'pageIndex',
            },
          });
        }
        return data.posts;
      })
      .catch((error: GraphQLError) => {
        if (retryIfUnauthorized && (<any>error.extensions?.response)?.status === StatusCodes.UNAUTHORIZED) {
          logger.info('Re-fetching posts from page %d due to expired SL token', pageNumber);
          return this.fetchPostsByPage(pageIndex, false);
        }
        throw error;
      });
  }

  async fetchPostsByUser(userId: string): Promise<UserPost[]> {
    return this.fetchPostsAndMerge((pageIndex) =>
      this.fetchPostsByPage(pageIndex).then((posts) => posts.filter((p) => p.from_id === userId))
    );
  }

  private async fetchPostsAndMerge(getSinglePageFn: (pageIndex: number) => Promise<UserPost[]>) {
    const pageIndexes: number[] = Array.from(Array(this.pageCount).keys()); // from 0 to N-1;
    const pagePromises$: Promise<UserPost[]>[] = pageIndexes.map(getSinglePageFn);
    return Promise.all(pagePromises$).then((data) => data.flat());
  }

  async fetchStatsByUser(userId: string): Promise<UserStats> {
    const posts$ = this.fetchPostsByUser(userId);
    return posts$.then((posts) => {
      let maxLength = 0;
      let totalLength = 0.0;

      for (let post of posts) {
        if (maxLength < post.message.length) {
          maxLength = post.message.length;
        }

        totalLength += post.message.length;
      }

      return {
        id: userId,
        name: posts[0].from_name,
        totalNumber: posts.length,
        averageLength: totalLength / posts.length,
        maxLength,
      };
    });
  }
}
