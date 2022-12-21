import { GraphQLServer } from './graphql/graphql-server';

const { url } = await new GraphQLServer().startStandaloneServer();

console.log(`🚀  GraphQL Server ready at: ${url}`);
