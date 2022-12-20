import { gql, Variables } from 'graphql-request';
import { Blog } from '../models/blog';
import { Post } from '../models/post';
import { User } from '../models/user';
import { logger } from '../utils/logger';
import { Utils } from '../utils/utils';
import { BackendError } from '../utils/backend-error';

/**
 * Provides services for fetching data from GraphQL Server.
 */
export class GraphQLClient {
  /**
   * Create the service provider.
   * @param backendUrl The backend URL is specified every time because environement variable
   * process.env.XXX is invisible on the client side while using SWR.
   */
  constructor(protected backendUrl: string) {}

  // /**
  //  * Fetch the raw query data. This method can be overridden by child classes.
  //  * @param query
  //  * @param variables
  //  * @returns
  //  */
  // protected async fetchQuery<T>(
  //   query: string,
  //   variables?: Variables
  // ): Promise<T> {
  //   return request<T>(this.backendUrl, query, variables).finally(() =>
  //     logger.debug('[GraphQL] Done.')
  //   );
  // }

  /**
   * Fetch the raw query data with the standard fetch API instead of
   * 'graphql-request' for better control.
   *
   * This method can be overridden by child classes.
   * @param query
   * @param variables
   * @returns
   */
  protected fetchQuery<T>(query: string, variables?: Variables): Promise<T> {
    return fetch(this.backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const error = new BackendError(
            'An error occurred while fetching the data.',
            res.status,
            await res.json()
          );
          throw error;
        }
        return res.json(); // Promise<any>
      })
      .then((res: any) => res.data)
      .finally(() => logger.debug('[GraphQL] Done.'));
  }

  /**
   * Fetch the blog data.
   * @param query
   * @param variables
   * @returns
   */
  private async fetchBlog(query: string, variables?: Variables): Promise<Blog> {
    return this.fetchQuery<{ blog: Blog }>(query, variables).then(
      (data) => data.blog
    );
  }

  /**
   * Fetch all posts with filter.
   * @param pageIndex Zero-based page index
   * @param pageSize Page size
   * @param userId User ID, if null then no user filter will be applied.
   * @returns
   */
  async fetchPosts(
    pageIndex: number,
    pageSize: number,
    userId: string | null
  ): Promise<{ posts: Post[]; totalPostCount: number }> {
    const filter = { pageIndex, pageSize, userId };
    logger.debug(
      `[GraphQL] Fetching posts with filter ${JSON.stringify(filter)}...`
    );
    const query = gql`
      query fetchPosts($pageIndex: Int!, $pageSize: Int!, $userId: ID) {
        blog(
          filter: {
            page: { index: $pageIndex, size: $pageSize }
            userId: $userId
          }
        ) {
          posts {
            id
            userId
            userName
            type
            createdTime
            message
          }
          totalPostCount
        }
      }
    `;

    return this.fetchBlog(query, filter);
  }

  /**
   * Fetch the list of all users. This method is needed for getStaticPaths() in the dashboard page.
   * @returns
   */
  async fetchUserIds(): Promise<string[]> {
    logger.debug('[GraphQL] Fetching user IDs...');
    const query = gql`
      query FetchUsers {
        users {
          userId
          userName
        }
      }
    `;

    return this.fetchQuery<{ users: User[] }>(query).then((data) =>
      Utils.sortArray(data.users, (u) => u.userName).map((s) => s.userId)
    );
  }

  /**
   * Fetch full user statistics with user filter. Because the dashboard page always needs statistics
   * for all users, so this parameter is currently not used anywhere.
   * @param userId User ID, if null then no user filter will be applied.
   * @returns
   */
  async fetchFullStats(userId?: string): Promise<User[]> {
    logger.debug(`[GraphQL] Fetching full stats for user ${userId}...`);
    const query = gql`
      query fetchLongestPost($userId: ID) {
        blog(filter: { userId: $userId }) {
          authors {
            userId
            userName
            stats {
              averageLength
              minLength
              maxLength
              totalCount
              frequencies {
                month
                count
              }
              longestPosts {
                id
                userId
                userName
                type
                createdTime
                message
              }
            }
          }
        }
      }
    `;

    return this.fetchBlog(query, { userId }).then((blog) => blog.authors);
  }
}
