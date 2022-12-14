import request, { gql, Variables } from 'graphql-request';
import { Blog } from '../models/blog';
import { Post } from '../models/post';
import { UserStats } from '../models/user-stats';
import { logger } from '../utils/logger';
import { sortArray } from '../utils/utils';

export class PostService {
  constructor(private backendUrl: string) {}

  private async fetchBlog(query: string, variables?: Variables): Promise<Blog> {
    return request<{ blog: Blog }>(this.backendUrl, query, variables)
      .then((data) => data.blog)
      .finally(() => logger.debug('[GraphQL] Done.'));
  }

  async fetchPosts(
    pageIndex: number,
    pageSize: number,
    userId: string | null
  ): Promise<{posts: Post[], totalPostCount: number}> {
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

  async fetchStats(): Promise<UserStats[]> {
    logger.debug('[GraphQL] Fetching user stats.');
    const query = gql`
      query GetStats {
        blog {
          stats {
            userId
            userName
            averageLength
            minLength
            maxLength
            totalCount
            frequencies {
              month
              count
            }
          }
        }
      }
    `;

    return this.fetchBlog(query).then((blog) => blog.stats);
  }

  async fetchUserIds(): Promise<string[]> {
    logger.debug('[GraphQL] Fetching user IDs...');
    const query = gql`
      query GetStats {
        blog {
          stats {
            userId
            userName
          }
        }
      }
    `;

    return this.fetchBlog(query).then((blog) =>
      sortArray(blog.stats, (s) => s.userName).map((s) => s.userId)
    );
  }

  async fetchStatsAndLongestPosts(
    userId?: string
  ): Promise<{ stats: UserStats[]; longestPosts: Post[] }> {
    logger.debug('[GraphQL] Fetching user stats and longest posts...');
    const query = gql`
      query fetchLongestPost($userId: ID) {
        blog(filter: { userId: $userId }) {
          stats {
            userId
            userName
            averageLength
            minLength
            maxLength
            totalCount
            frequencies {
              month
              count
            }
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
    `;

    return this.fetchBlog(query, { userId });
  }
}
