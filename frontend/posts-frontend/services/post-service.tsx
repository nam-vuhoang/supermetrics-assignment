import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { NormalizedCacheObject } from "@apollo/client/cache";
import { ApolloQueryResult, DocumentNode } from "@apollo/client/core";
import { Post } from "../models/post";
import { Blog } from "../models/blog";

export class PostService {
  private static readonly instance = new PostService();

  static getInstance() {
    return this.instance;
  }

  private apolloClient: ApolloClient<NormalizedCacheObject>;

  constructor() {
    this.apolloClient = new ApolloClient({
      uri: "http://localhost:8081",
      cache: new InMemoryCache(),
    });
  }

  private async queryBlog(query: DocumentNode): Promise<Blog> {
    return this.apolloClient.query<{ blog: Blog }>({ query }).then((response) => response.data.blog);
  }

  async getLastPosts(size: number): Promise<any> {
    const query = gql`
      query GetLastPostsFromAllUsers {
        blog(filter: { page: { index: 0, size: ${size} } }) {
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
