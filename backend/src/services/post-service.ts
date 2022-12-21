import { RESTDataSource } from '@apollo/datasource-rest';
import { Post } from '../models/post';
import { HttpResponse } from '../models/http-response';
import { logger } from '../utils/logger';
import { GraphQLError, Token } from 'graphql';
import { StatusCodes } from 'http-status-codes';
import { PostFilter } from '../models/post-filter';
import { Blog } from '../models/blog';
import { Utils } from '../utils/utils';
import { User } from '../models/user';
import { KeyValueCache } from '@apollo/utils.keyvaluecache';
import { AuthenticationService } from './authentication-service';

interface RawPost {
  id: string;
  from_id: string;
  from_name: string;
  message: string;
  type: string;
  created_time: string;
}

function mapRawPostToPost(rawPost: RawPost): Post {
  return {
    id: rawPost.id,
    userId: rawPost.from_id,
    userName: rawPost.from_name,
    message: rawPost.message,
    type: rawPost.type,
    createdTime: new Date(rawPost.created_time),
  };
}

export interface RawPostData {
  page: number;
  posts: Array<RawPost>;
}

export class PostService extends RESTDataSource {
  static readonly REQUEST_PATH = 'posts';
  static readonly MAX_RETRY_COUNT_IF_UNAUTHORIZED = 5;

  private pageCount: number;

  constructor(
    public baseURL: string,
    private authenticationService: AuthenticationService,
    cache: KeyValueCache | undefined,
    pageCount: number
  ) {
    super({ cache }); // this sends our server's `cache` through
    // cache get-request results
    this.memoizeGetRequests = true;
    this.pageCount = pageCount;
  }

  /**
   * Fetchs all user posts filtered by userId with sorting and pagination if required.
   * @param filter
   * @returns
   */
  async fetchPosts(filter?: PostFilter): Promise<Blog> | null {
    if (filter?.page?.index !== undefined && filter.page.index < 0) {
      throw new EvalError(`Invalid page index: ${filter.page.index}`);
    }

    if (filter?.page?.size !== undefined && filter.page.size <= 0) {
      throw new EvalError(`Invalid page size: ${filter.page.size}`);
    }

    logger.info('Fetching posts with filter %s', JSON.stringify(filter));

    const { userId, page: pageFilter, sortByCreatedTimeAsc } = filter || {};

    // Get all raw posts from all pages
    // logger.info('Fetching all posts from %d pages', this.pageCount);
    const pageIndexes: number[] = Array.from(Array(this.pageCount).keys()); // from 0 to N-1;
    let pages$: Promise<RawPost[]>[] = pageIndexes.map((pageIndex) =>
      this.fetchRawPostsByPageAndUser(pageIndex, userId)
    );

    // Merge pages and normalize posts
    const posts$: Promise<Post[]> = Promise.all(pages$).then((rawPosts) => rawPosts.flat().map(mapRawPostToPost));

    // Sort and paginate if needed
    return posts$
      .then((posts) => Blog.createBlog(posts, pageFilter, sortByCreatedTimeAsc))
      .then((blog) => {
        logger.debug('Returning %d posts', blog.size);
        return blog;
      });
  }

  /**
   * Fetchs all user posts filtered by userId with sorting and pagination if required.
   * @param filter
   * @returns
   */
  async fetchUsers(): Promise<User[]> {
    logger.info('Fetching all users');

    // Get all raw posts from all pages
    logger.info('Fetching all posts from %d pages', this.pageCount);
    const pageIndexes: number[] = Utils.createNumberRange(this.pageCount); // from 0 to N-1;
    let pages$: Promise<RawPost[]>[] = pageIndexes.map((pageIndex) =>
      this.fetchRawPostsByPageAndUser(pageIndex, undefined)
    );

    // Merge pages and normalize posts
    const userMap = new Map<string, User>();
    return Promise.all(pages$).then((pages) => {
      for (let page of pages) {
        for (let rawPost of page) {
          const { from_id: userId, from_name: userName } = rawPost;
          const user = userMap.get(userId);
          if (!user) {
            userMap.set(userId, { userId, userName });
          }
        }
      }
      return Array.from(userMap.values());
    });
  }

  /**
   * Fetchs all raw user posts from a single page, filtered by userId if specified.
   * In case of the Unauthorized error due to the short-lived token expiration,
   * this method retries again with the refreshed token.
   * @param pageIndex
   * @returns
   */
  private async fetchRawPostsByPageAndUser(pageIndex: number, userId: string | undefined): Promise<RawPost[]> {
    const pageNumber = pageIndex + 1;
    // logger.debug('Fetching posts from page %d', pageNumber);

    let rawPosts$: Promise<RawPost[]> = this.fetchRawData(pageNumber.toString()).then((data) => {
      // logger.debug('Loaded page: %d (size: %d)', data.page, data.posts.length);
      // Validate page number
      if (data.page !== pageNumber) {
        throw new GraphQLError(`Invalid data: expected page ${pageNumber}, but got page ${data.page}.`, {
          extensions: {
            code: 'DATA_SERVER_ERROR',
            argumentName: 'pageIndex',
          },
        });
      }
      return data.posts;
    });

    if (!userId) {
      return rawPosts$;
    }

    const userFilter = (p: RawPost) => p.from_id === userId;
    return rawPosts$.then((posts) => posts.filter(userFilter));
  }

  /**
   * Fetching raw data with retrial in case of 401-Unauthorized error.
   * @param pageNumber - 1-based page number
   * @param retryCount
   * @returns
   */
  private async fetchRawData(pageNumber: string, retryCount: number = 0): Promise<RawPostData> {
    return this.authenticationService
      .getToken()
      .then((token) => this.internalFetchRawData(pageNumber, token))
      .catch((error: GraphQLError) => {
        if (
          (<any>error.extensions?.response)?.status === StatusCodes.UNAUTHORIZED &&
          retryCount < PostService.MAX_RETRY_COUNT_IF_UNAUTHORIZED
        ) {
          logger.info('Re-fetching posts from page %d due to expired SL token', pageNumber);

          // notify authentication service about token expiration
          this.authenticationService.notifyTokenExpired();

          // retry again (without any filter)
          return this.fetchRawData(pageNumber, ++retryCount);
        }

        throw error;
      });
  }

  /**
   * Fetching raw data. This method is made protected so that child mock test classes can override it.
   * @param pageNumber - 1-based page number
   * @returns
   */
  protected async internalFetchRawData(pageNumber: string, token: string): Promise<RawPostData> {
    return this.get<HttpResponse<RawPostData>>(PostService.REQUEST_PATH, {
      params: {
        sl_token: token,
        page: pageNumber.toString(),
      },
    }).then((response) => response.data);
  }
}
