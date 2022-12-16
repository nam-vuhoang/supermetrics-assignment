import { ApolloServer } from '@apollo/server';
import { ExecuteOperationOptions, VariableValues } from '@apollo/server/dist/esm/externalTypes/graphql';
import { assert } from 'console';
import { DocumentNode, TypedQueryDocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { GraphQLContextEx } from '../../src/graphql/graphql-context';
import { logger } from '../../src/utils/logger';
import { Utils } from '../../src/utils/utils';
import { Blog as Blog } from './models/blog';
import { User } from './models/user';

export const MAX_POST_COUNT = 1000;

/**
 * Helping methods
 */
export async function fetchRawData<T>(
  server: ApolloServer<GraphQLContextEx>,
  executionOptions: ExecuteOperationOptions<GraphQLContextEx>,
  query: string | DocumentNode | TypedQueryDocumentNode<T, VariableValues>,
  variables?: VariableValues
): Promise<T> {
  return server
    .executeOperation<T>(
      {
        query,
        variables,
      },
      executionOptions
    )
    .then((response) => {
      const { body } = response;
      assert(body.kind === 'single');

      const { singleResult } = <any>body;
      if (singleResult.errors) {
        throw singleResult.errors;
      }

      return singleResult.data as T;
    });
}

export async function fetchBlog(
  server: ApolloServer<GraphQLContextEx>,
  executionOptions: ExecuteOperationOptions<GraphQLContextEx>,
  query: string | DocumentNode | TypedQueryDocumentNode<Blog, VariableValues>,
  variables?: VariableValues
): Promise<Blog> {
  return fetchRawData<{ blog: Blog }>(server, executionOptions, query, variables).then((data) => data.blog);
}

export async function fetchPosts(
  server: ApolloServer<GraphQLContextEx>,
  executionOptions: ExecuteOperationOptions<GraphQLContextEx>,
  filter: {
    pageIndex: number;
    pageSize: number;
    userId: string | null;
  }
): Promise<Blog> {
  const query = gql`
    query FetchPosts($pageIndex: Int!, $pageSize: Int!, $userId: ID) {
      blog(filter: { page: { index: $pageIndex, size: $pageSize }, userId: $userId }) {
        posts {
          id
          userId
          userName
          type
          createdTime
          message
        }
        size
        totalPostCount
      }
    }
  `;

  return fetchBlog(server, executionOptions, query, filter);
}

export async function fetchUserIds(
  server: ApolloServer<GraphQLContextEx>,
  executionOptions: ExecuteOperationOptions<GraphQLContextEx>
): Promise<string[]> {
  const query = gql`
    query FetchUsers {
      users {
        userId
        userName
      }
    }
  `;

  return fetchRawData<{ users: User[] }>(server, executionOptions, query).then((data) =>
    Utils.sortArray(data.users, (u) => u.userName).map((s) => s.userId)
  );
}

export async function fetchFullStats(
  server: ApolloServer<GraphQLContextEx>,
  executionOptions: ExecuteOperationOptions<GraphQLContextEx>,
  userId?: string
): Promise<User[]> {
  logger.debug(`[GraphQL] Fetching full stats for user ${userId}...`);
  const query = gql`
    query fetchUserStats($userId: ID) {
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

  return fetchBlog(server, executionOptions, query, { userId }).then((blog) => blog.authors);
}
