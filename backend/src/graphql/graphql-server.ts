import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { PostService } from '../services/posts-service';
import { AuthenticationService } from '../services/authentication-service';
import { environment } from '../environment/environment';
import gql from 'graphql-tag';

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  #graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }
`;

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
];

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books,
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

export class GraphQLServer {
  private authenticationService: AuthenticationService;

  constructor() {
    this.authenticationService = new AuthenticationService(
      environment.dataServer.baseUrl,
      environment.dataServer.clientInfo
    );
  }

  async start(): Promise<{ url: string }> {
    return startStandaloneServer(server, {
      listen: { port: environment.graphqlServer.port },
      context: async ({ req }) => {
        return {
          authenticationService: this.authenticationService,
        };

        // // We'll take Apollo Server's cache
        // // and pass it to each of our data sources
        // return {
        //   dataSources: {
        //     postsApi: new PostService(environment.dataServer.baseUrl, {
        //       cache: server.cache,
        //       token,
        //       pageCount: environment.dataServer.pageCount,
        //     }),
        //   },
        // };
      },
    });
  }
}
