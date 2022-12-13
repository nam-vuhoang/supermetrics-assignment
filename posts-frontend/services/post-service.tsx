import request, { gql } from 'graphql-request';
import useSWR, { SWRResponse } from 'swr';
import { environment } from '../environment/environment';
import { Blog } from '../models/blog';
import { Post } from '../models/post';
import { UserStats } from '../models/user-stats';
import { logger } from '../utils/logger';

export class PostService {
  private static readonly instance = new PostService();

  static getInstance() {
    return this.instance;
  }

  private async fetchBlog(query: string): Promise<Blog> {
    return request<{ blog: Blog }>(environment.backendUrl, query).then(
      (data) => data.blog
    );
  }

  async fetchPageCount(
    pageSize: number,
    userId: string | null
  ): Promise<number> {
    const userFilter = userId ? `userId: "${userId}"` : '';

    logger.debug(`Fetching page count with filter {${userFilter}}...`);
    const query = gql`
      query GetLastPostsFromAllUsers {
        blog(filter: { ${userFilter} }) {
          size
        }
      }
    `;

    return this.fetchBlog(query).then((blog) =>
      Math.ceil(blog.size / pageSize)
    );
  }

  async fetchPosts(
    pageIndex: number,
    pageSize: number,
    userId: string | null
  ): Promise<Post[]> {
    const pageFilter = `page: { index: ${pageIndex}, size: ${pageSize} }`;
    const userFilter = userId ? `, userId: "${userId}"` : '';

    logger.debug(`Fetching posts with filter {${pageFilter}${userFilter}}...`);
    const query = gql`
      query GetLastPostsFromAllUsers {
        blog(filter: { ${pageFilter}${userFilter} }) {
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

    return this.fetchBlog(query).then((blog) => blog.posts);
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

  async fetchLongestPost(userId: string): Promise<Post | null> {
    const userFilter = `userId: "${userId}"`;

    logger.debug(`Fetching posts with filter {${userFilter}}`);
    const query = gql`
      query GetLastPostsFromAllUsers {
        blog(filter: {${userFilter}}) {
          longestPost {
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

    return this.fetchBlog(query).then((blog) => blog.longestPost);
  }
}
