import request, { gql, Variables } from 'graphql-request';
import { Blog } from '../models/blog';
import { Post } from '../models/post';
import { User } from '../models/user';
import { logger } from '../utils/logger';
import { sortArray } from '../utils/utils';

export class PostService {
  constructor(private backendUrl: string) {}

  private async fetchRawData<T>(
    query: string,
    variables?: Variables
  ): Promise<T> {
    return request<T>(this.backendUrl, query, variables).finally(() =>
      logger.debug('[GraphQL] Done.')
    );
  }

  private async fetchBlog(query: string, variables?: Variables): Promise<Blog> {
    return this.fetchRawData<{ blog: Blog }>(query, variables).then(
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
      query GetLastPostsFromAllUsers(
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
      query GetUsers {
        users {
          userId
          userName
        }
      }
    `;

    return this.fetchRawData<{ users: User[] }>(query).then((data) =>
      sortArray(data.users, (u) => u.userName).map((s) => s.userId)
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
