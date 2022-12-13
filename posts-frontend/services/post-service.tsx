import request, { gql, Variables } from 'graphql-request';
import { Blog } from '../models/blog';
import { Post } from '../models/post';
import { UserStats } from '../models/user-stats';
import { logger } from '../utils/logger';

export class PostService {
  constructor(private backendUrl: string) {
  }

  private async fetchBlog(query: string, variables?: Variables): Promise<Blog> {
    return request<{ blog: Blog }>(
      this.backendUrl,
      query,
      variables
    ).then((data) => data.blog);
  }

  async fetchPageCount(
    pageSize: number,
    userId: string | null
  ): Promise<number> {
    logger.debug(`Fetching page count for user ${userId}.`);
    const query = gql`
      query GetLastPostsFromAllUsers($userId: ID) {
        blog(filter: { userId: $userId }) {
          size
        }
      }
    `;

    return this.fetchBlog(query, { userId }).then((blog) =>
      Math.ceil(blog.size / pageSize)
    );
  }

  async fetchPosts(
    pageIndex: number,
    pageSize: number,
    userId: string | null
  ): Promise<Post[]> {
    const filter = { pageIndex, pageSize, userId };
    logger.debug(`Fetching posts with filter ${JSON.stringify(filter)}.`);
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
        }
      }
    `;

    return this.fetchBlog(query, filter).then((blog) => blog.posts);
  }

  async fetchStats(): Promise<UserStats[]> {
    logger.debug('Fetching user stats');
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

  async fetchLongestPost(userId: string): Promise<Post[]> {
    logger.debug('Fetching user longest posts.');
    const query = gql`
      query fetchLongestPost($userId: String!) {
        blog(filter: { userId: $userId }) {
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

    return this.fetchBlog(query, { userId }).then((blog) => blog.longestPosts);
  }
}
