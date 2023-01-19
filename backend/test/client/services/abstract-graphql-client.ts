import { DocumentNode } from 'graphql';
import { Blog } from '../models/blog';
import { Post } from '../models/post';
import { User } from '../models/user';
import { logger } from '../../../src/utils/logger';
import { Utils } from '../../../src/utils/utils';

import { gql } from 'graphql-tag'; // Use 'gql' from 'graphql-request' on client side
export declare type Query = string | DocumentNode; // This t

export interface Variables {
  [name: string]: any;
}

/**
 * Provides services for fetching data from GraphQL Server.
 */
export abstract class AbstractGraphQLClient {
  /**
   * Fetch the raw query data.
   * @param query
   * @param variables
   * @returns
   */
  protected abstract fetchQuery<T>(query: Query, variables?: Variables): Promise<T>;

  /**
   * Fetch the blog data.
   * @param query
   * @param variables
   * @returns
   */
  private async fetchBlog(query: Query, variables?: Variables): Promise<Blog> {
    return this.fetchQuery<{ blog: Blog }>(query, variables).then((data) => data.blog);
  }

  /**
   * Fetch all posts with filter.
   * @param pageIndex Zero-based page index
   * @param pageSize Page size
   * @param userId User ID, if null then no user filter will be applied.
   * @returns
   */
  async fetchPosts(filter: {
    pageIndex: number;
    pageSize: number;
    userId: string | null;
  }): Promise<{ posts: Post[]; totalPostCount: number }> {
    logger.debug(`[GraphQL] Fetching posts with filter ${JSON.stringify(filter)}...`);
    const query = gql`
      query fetchPosts($pageIndex: Int!, $pageSize: Int!, $userId: ID) {
        blog(filter: { page: { index: $pageIndex, size: $pageSize }, userId: $userId }) {
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
      query fetchUserIds {
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
  async fetchFullStats(filter?: { userId?: string }): Promise<User[]> {
    logger.debug(`[GraphQL] Fetching full stats for filter ${filter}...`);
    const query = gql`
      query fetchFullStats($userId: ID) {
        blog(filter: { userId: $userId }) {
          authors {
            userId
            userName
            stats {
              averageLength
              medianLength
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

    return this.fetchBlog(query, filter).then((blog) => blog.authors);
  }
}
