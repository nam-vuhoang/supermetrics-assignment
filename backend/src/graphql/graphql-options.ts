import gql from 'graphql-tag';
import { GraphQLScalarType, Kind } from 'graphql';
import { environment } from '../environment/environment';
import { UserPostFilter } from '../models/user-post-filter';
import { UserPostService } from '../services/user-post-service';
import { GraphQLContext } from './graphql-context';

export const graphQLOptions = {
  typeDefs: gql`
    type Query {
      userPosts(filter: UserPostFilter): UserPostCollection
    }

    type UserPostCollection {
      size: Int!
      posts: [UserPost!]!
      stats: [UserStats!]!
    }

    type UserPost {
      id: ID!
      userId: ID!
      userName: String!
      message: String!
      type: String!
      createdTime: Date!
    }

    type UserStats {
      userId: ID!
      userName: String!
      totalCount: Int!
      averageLength: Float!
      maxLength: Int!
      frequencies: [Frequency!]!
    }

    type Frequency {
      month: Date!
      count: Int!
    }

    input UserPostFilter {
      userId: ID
      page: PageFilter
      sortByCreatedTimeAsc: Boolean
    }

    input PageFilter {
      index: Int!
      size: Int!
    }

    scalar Date
  `,

  resolvers: {
    Date: new GraphQLScalarType({
      name: 'Date',
      description: 'Date custom scalar type',

      serialize(value: Date) {
        return value.getTime(); // Convert outgoing Date to integer for JSON
      },

      parseValue(value: number) {
        return new Date(value); // Convert incoming integer to Date
      },

      parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
          // Convert hard-coded AST string to integer and then to Date
          const time = Number(ast.value);
          if (!isNaN(time)) {
            return new Date(time);
          }
        }

        // Invalid hard-coded value (not an integer)
        return null;
      },
    }),

    Query: {
      userPosts(root: any, args: { filter: UserPostFilter }, context: GraphQLContext) {
        return new UserPostService(
          context,
          environment.dataServer.baseUrl,
          environment.dataServer.pageCount
        ).fetchPosts(args.filter);
      },
    },
  },
};
