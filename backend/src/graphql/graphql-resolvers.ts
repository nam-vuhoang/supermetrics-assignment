import { GraphQLScalarType, Kind } from "graphql";
import { BlogFilter } from "../models/blog-filter";
import { GraphQLContext } from "./graphql-context";

/**
 * GraphQL resolvers for Query, Mutation, and Scalar types.
 */
export const GRAPHQL_RESOLVERS = {
  Query: {
    blog(_: any, args: { filter: BlogFilter }, context: GraphQLContext) {
      return context.postServiceBuilder(context.authenticationService, context.cache).fetchBlog(args.filter);
    },

    users(_: any, args: { filter: BlogFilter }, context: GraphQLContext) {
      return context.postServiceBuilder(context.authenticationService, context.cache).fetchUsers();
    },
  },

  /**
   * The Date scalar type. Serialized using UNIT time stamp.
   */
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

};