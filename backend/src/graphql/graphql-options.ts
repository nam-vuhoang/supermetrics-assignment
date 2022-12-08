import gql from 'graphql-tag';
import { environment } from '../environment/environment';
import { UserPostService } from '../services/user-post-service';
import { logger } from '../utils/logger';
import { GraphQLContext } from './graphql-context';

export const graphQLOptions = {
  typeDefs: gql`
    #graphql
    type Query {
      userPostsByPage(pageIndex: Int!): [UserPost!]
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
      userPostsByPage: (parent, args, contextValue, info) => {
        const userPostService = new UserPostService(
          <GraphQLContext>contextValue,
          environment.dataServer.baseUrl,
          environment.dataServer.pageCount
        );
        return userPostService.fetchPostsByPage(args.pageIndex);
      },
    },
  },
};
