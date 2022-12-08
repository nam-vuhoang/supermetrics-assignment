import gql from 'graphql-tag';
import { environment } from '../environment/environment';
import { UserPostService } from '../services/user-post-service';
import { GraphQLContext } from './graphql-context';

function createUserPostService(context: GraphQLContext) {
  return new UserPostService(context, environment.dataServer.baseUrl, environment.dataServer.pageCount);
}

export const graphQLOptions = {
  typeDefs: gql`
    #graphql
    type Query {
      postsByPage(pageIndex: Int!): [UserPost!]
      postsByUser(userId: ID!): [UserPost!]
      statsByUser(userId: ID!): UserStats!
    }

    type UserPost {
      id: ID!
      from_id: ID!
      from_name: String!
      message: String!
      type: String!
      created_time: String!
    }

    type UserStats {
      id: ID!
      name: String!
      totalNumber: Int!
      averageLength: Float!
      maxLength: Int!
    }
  `,

  resolvers: {
    Query: {
      postsByPage: (_: any, args: any, contextValue: any) => {
        return createUserPostService(contextValue).fetchPostsByPage(args.pageIndex);
      },
      postsByUser: (_: any, args: any, contextValue: any) => {
        return createUserPostService(contextValue).fetchPostsByUser(args.userId);
      },
      statsByUser: (_: any, args: any, contextValue: any) => {
        return createUserPostService(contextValue).fetchStatsByUser(args.userId);
      },
    },
  },
};
