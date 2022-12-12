import { ApolloClient, gql, InMemoryCache } from '@apollo/client';
import { NormalizedCacheObject } from '@apollo/client/cache';
import { DocumentNode } from '@apollo/client/core';
import { environment } from '../environment/environment';
import { Blog } from '../models/blog';
import { requireStringEnvParam } from '../utils/environment-utils';

export class PostService {
  private static readonly instance = new PostService();

  static getInstance() {
    return this.instance;
  }

  private apolloClient: ApolloClient<NormalizedCacheObject>;

  constructor() {
    this.apolloClient = new ApolloClient({
      uri: environment.backendUrl,
      cache: new InMemoryCache(),
    });
  }

  private async queryBlog(query: DocumentNode): Promise<Blog> {
    return this.apolloClient
      .query<{ blog: Blog }>({ query })
      .then((response) => response.data.blog);
  }

  async getPosts(
    pageIndex: number,
    pageSize: number,
    userId?: string
  ): Promise<any> {
    const pageFilter = `page: { index: ${pageIndex}, size: ${pageSize} }`;
    const userFilter = userId ? `, userId: "${userId}"` : '';
    const query = gql`
      query GetLastPostsFromAllUsers {
        blog(filter: { ${pageFilter} ${userFilter} }) {
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

    return this.queryBlog(query).then((blog) => blog.posts);
  }
}
