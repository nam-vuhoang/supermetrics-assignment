import { GraphQLServer } from './graphql/graphql-server';

const { url } = await new GraphQLServer().start();

console.log(`🚀  GraphQL Server ready at: ${url}`);
