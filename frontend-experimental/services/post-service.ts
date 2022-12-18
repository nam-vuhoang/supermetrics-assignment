import request, { gql, Variables } from 'graphql-request';
import { Blog } from '../models/blog';
import { Post } from '../models/post';
import { User } from '../models/user';
import { logger } from '../utils/logger';
import { Utils } from '../utils/utils';

export class PostService {
  constructor(protected backendUrl: string) {}

  protected async fetchQuery<T>(
    query: string,
    variables?: Variables
  ): Promise<T> {
    return request<T>(this.backendUrl, query, variables).finally(() =>
      logger.debug('[GraphQL] Done.')
    );
  }

  private async fetchBlog(query: string, variables?: Variables): Promise<Blog> {
    return this.fetchQuery<{ blog: Blog }>(query, variables).then(
      (data) => data.blog
    );
  }

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
      query fetchPosts(
        $pageIndex: Int!
        $pageSize: Int!
        $userId: ID
      ) {
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
