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
      users: [User!]!
    }

    type Blog {
      size: Int!
      posts: [Post!]!
      authors: [User!]!
      totalPostCount: Int!
    }

    type Post {
      id: ID!
      userId: ID!
      userName: String!
      message: String!
      type: String!
      createdTime: Date!
    }

    type User {
      userId: ID!
      userName: String!
      stats: UserStats!
    }

    type UserStats {
      totalCount: Int!
      averageLength: Float!
      minLength: Int!
      maxLength: Int!
      frequencies: [Frequency!]!
      longestPosts: [Post!]!
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
        return context.postServiceProvider(context).fetchPosts(args.filter);
      },

      users(_: any, args: { filter: PostFilter }, context: GraphQLContext) {
        return context.postServiceProvider(context).fetchUsers();
      },
    },
  },
};
