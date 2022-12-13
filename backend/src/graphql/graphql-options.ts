import gql from 'graphql-tag';
import { GraphQLScalarType, Kind } from 'graphql';
import { environment } from '../environment/environment';
import { PostFilter } from '../models/post-filter';
import { PostService } from '../services/post-service';
import { GraphQLContext } from './graphql-context';

export const graphQLOptions = {
  typeDefs: gql`
    type Query {
      blog(filter: PostFilter): Blog
      longestPost(userId: ID!): Post
    }

    type Blog {
      size: Int!
      posts: [Post!]!
      stats: [UserStats!]!
    }

    type Post {
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
      minLength: Int!
      maxLength: Int!
      frequencies: [Frequency!]!
    }

    type Frequency {
      month: Date!
      count: Int!
    }

    input PostFilter {
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
      blog(_: any, args: { filter: PostFilter }, context: GraphQLContext) {
        return new PostService(
          context,
          environment.dataServer.baseUrl,
          environment.dataServer.pageCount
        ).fetchPosts(args.filter);
      },
      longestPost(_: any, args: { userId: string }, context: GraphQLContext) {
        return new PostService(
          context,
          environment.dataServer.baseUrl,
          environment.dataServer.pageCount
        ).fetchLongestPost(args.userId);
      },

    },
  },
};
