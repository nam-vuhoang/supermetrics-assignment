import { RESTDataSource } from '@apollo/datasource-rest';
import { GraphQLContext } from '../graphql/graphql-context';
import { UserPost } from '../models/user-post';
import { HttpResponse } from '../models/http-response';
import { logger } from '../utils/logger';
import { GraphQLError } from 'graphql';
import { StatusCodes } from 'http-status-codes';
import { UserPostFilter } from '../models/user-post-filter';
import { UserPostCollection } from '../models/user-post-collection';
import { PageFilter } from '../models/page-filter';
import { sortArray } from '../utils/utils';

interface RawUserPost {
  id: string;
  from_id: string;
  from_name: string;
  message: string;
  type: string;
  created_time: string;
}

interface RawPostData {
  page: number;
  posts: Array<RawUserPost>;
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
   * Fetchs all
   * @param pageIndex
   * @returns
   */
  private async fetchPostsByPage(pageIndex: number, retryIfUnauthorized: boolean = true): Promise<UserPost[]> {
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
      .then((posts) =>
        posts.map((p) => {
          return {
            id: p.id,
            userId: p.from_id,
            userName: p.from_name,
            message: p.message,
            type: p.type,
            createdTime: new Date(p.created_time),
          };
        })
      )
      .catch((error: GraphQLError) => {
        if (retryIfUnauthorized && (<any>error.extensions?.response)?.status === StatusCodes.UNAUTHORIZED) {
          logger.info('Re-fetching posts from page %d due to expired SL token', pageNumber);
          return this.fetchPostsByPage(pageIndex, false);
        }
        throw error;
      });
  }

  async fetchPosts(filter?: UserPostFilter): Promise<UserPostCollection> | null {
    const { userId, page, sortByCreatedTimeAsc } = filter || {};
    // Get all pages
    logger.info('Fetching all posts from %d pages', this.pageCount);
    const pageIndexes: number[] = Array.from(Array(this.pageCount).keys()); // from 0 to N-1;
    let pages$: Promise<UserPost[]>[] = pageIndexes.map(pageIndex => this.fetchPostsByPage(pageIndex));
    if (userId) {
      const postFilter = (p: UserPost) => p.userId === userId;
      pages$ = pages$.map(posts$ => posts$.then(posts => posts.filter(postFilter)));
    }

    // Merge pages
    const posts$ = Promise.all(pages$).then((data) => data.flat());

    // Sort and paginate
    return posts$.then((posts) => UserPostService.sortAndPaginate(posts, page, sortByCreatedTimeAsc));
  }

  private static sortAndPaginate(
    posts: UserPost[],
    page?: PageFilter,
    sortByCreatedTimeAsc?: boolean
  ): UserPostCollection {
    if (sortByCreatedTimeAsc !== undefined || page) {
      if (sortByCreatedTimeAsc == undefined) {
        sortByCreatedTimeAsc = true;
      }
      posts = sortArray(posts, (p) => p.createdTime.getTime(), !sortByCreatedTimeAsc);
    }

    if (page) {
      posts = posts.slice(page.start, page.end);
    }
    return new UserPostCollection(posts);
  }
}
