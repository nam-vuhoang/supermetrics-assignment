import { GRAPHQ_SCHEMA } from './graphql-schema';
import { GRAPHQL_RESOLVERS } from './graphql-resolvers';

export const GRAPHQL_OPTIONS = {
  typeDefs: GRAPHQ_SCHEMA,
  resolvers: GRAPHQL_RESOLVERS
};
