import gql from 'graphql-tag';
import { environment } from '../environment/environment';
import { UserPostService } from '../services/user-post-service';
import { logger } from '../utils/logger';
import { GraphQLContext } from './graphql-context';

function createUserPostService(context: GraphQLContext) {
  return new UserPostService(context, environment.dataServer.baseUrl, environment.dataServer.pageCount);
}

export const graphQLOptions = {
  
  typeDefs: gql`
    #graphql
    type Query {
      userPostsByPage(pageIndex: Int!): [UserPost!]
      userPostsByUser(userId: ID!): [UserPost!]
    }

    type UserPost {
      id: ID!
      from_id: ID!
      from_name: String!
      message: String!
      type: String!
      created_time: String!
    }
  `,

  resolvers: {
    Query: {
      userPostsByPage: (_: any, args: any, contextValue: any) => {
        return createUserPostService(contextValue).fetchPostsByPage(args.pageIndex);
      },
      userPostsByUser: (_: any, args: any, contextValue: any) => {
        return createUserPostService(contextValue).fetchPostsByUser(args.userId);
      },
    },
  },
};
