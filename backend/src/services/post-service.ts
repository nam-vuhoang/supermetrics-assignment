import { RESTDataSource } from '@apollo/datasource-rest';
import { GraphQLContext } from '../graphql/graphql-context';
import { Post } from '../models/post';
import { HttpResponse } from '../models/http-response';
import { logger } from '../utils/logger';
import { GraphQLError } from 'graphql';
import { StatusCodes } from 'http-status-codes';
import { PostFilter } from '../models/post-filter';
import { Blog } from '../models/blog';
import { PageFilter } from '../models/page-filter';
import { sortArray } from '../utils/utils';

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

interface RawPostData {
  page: number;
  posts: Array<RawPost>;
}

export class PostService extends RESTDataSource {
  static readonly REQUEST_PATH = 'posts';

  private context: GraphQLContext;
  private pageCount: number;

  constructor(context: GraphQLContext, public baseURL: string, pageCount: number) {
    super(context); // this sends our server's `cache` through
    // cache get-request results
    this.memoizeGetRequests = true;
    this.context = context;
    this.pageCount = pageCount;
  }

  /**
   * Fetchs all raw user posts from a single page, filtered by userId if specified.
   * In case of the Unauthorized error due to the short-lived token expiration,
   * this method retries again with the refreshed token.
   * @param pageIndex
   * @returns
   */
  private async fetchRawPostsByPageAndUser(
    pageIndex: number,
    userId: string | undefined,
    retryCount: number = 0
  ): Promise<RawPost[]> {
    if (pageIndex < 0 || pageIndex >= this.pageCount) {
      throw new GraphQLError('Invalid argument value', {
        extensions: {
          code: 'BAD_USER_INPUT',
          argumentName: 'pageIndex',
        },
      });
    }

    const pageNumber = pageIndex + 1;
    logger.debug('Fetching posts from page %d', pageNumber);

    let rawPosts$: Promise<RawPost[]> = this.get<HttpResponse<RawPostData>>(PostService.REQUEST_PATH, {
      params: {
        sl_token: await this.context.authenticationService.getToken(),
        page: pageNumber.toString(),
      },
    })
      .then((response) => response.data)
      .then((data) => {
        logger.debug('Loaded page: %d (size: %d)', data.page, data.posts.length);
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
      })
      .catch((error: GraphQLError) => {
        if ((<any>error.extensions?.response)?.status === StatusCodes.UNAUTHORIZED && retryCount < 5) {
          logger.warn('Re-fetching posts from page %d due to expired SL token', pageNumber);

          // notify authentication service about token expiration
          this.context.authenticationService.notifyTokenExpired();

          // retry again (without any filter)
          return this.fetchRawPostsByPageAndUser(pageIndex, undefined, ++retryCount);
        }
        throw error;
      });

    return userId ? rawPosts$.then((posts) => posts.filter((p) => p.from_id === userId)) : rawPosts$;
  }

  /**
   * Fetchs all user posts filtered by userId with sorting and pagination if required.
   * @param filter
   * @returns
   */
  async fetchPosts(filter?: PostFilter): Promise<Blog> | null {
    logger.info('Fetching posts with filter %s', JSON.stringify(filter));

    const { userId, page, sortByCreatedTimeAsc } = filter || {};

    // Get all raw posts from all pages
    logger.info('Fetching all posts from %d pages', this.pageCount);
    const pageIndexes: number[] = Array.from(Array(this.pageCount).keys()); // from 0 to N-1;
    let pages$: Promise<RawPost[]>[] = pageIndexes.map((pageIndex) =>
      this.fetchRawPostsByPageAndUser(pageIndex, userId)
    );

    // Merge pages and normalize posts
    const posts$: Promise<Post[]> = Promise.all(pages$).then((rawPosts) => rawPosts.flat().map(mapRawPostToPost));

    // Sort and paginate if needed
    return posts$.then((posts) => PostService.sortAndPaginate(posts, page, sortByCreatedTimeAsc));
  }

  /**
   * Create a PostCollection, sort and paginate if needed.
   * @param posts
   * @param pageFilter
   * @param sortByCreatedTimeAsc
   * @returns
   */
  private static sortAndPaginate(posts: Post[], pageFilter?: PageFilter, sortByCreatedTimeAsc?: boolean): Blog {
    if (pageFilter || sortByCreatedTimeAsc !== undefined) {
      // reverse order if sortByCreatedTimeAsc is undefined or false
      posts = sortArray(posts, (p) => p.createdTime.getTime(), !sortByCreatedTimeAsc);
    }

    if (pageFilter) {
      const start = pageFilter.size * pageFilter.index;
      const end = pageFilter.size * (pageFilter.index + 1);
      posts = posts.slice(start, end);
    }

    logger.debug('Returning %d posts', posts.length);
    return new Blog(posts);
  }
}
