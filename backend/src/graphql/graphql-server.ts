import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { AuthenticationService } from '../services/authentication-service';
import { environment } from '../environment/environment';
import { GraphQLContext } from './graphql-context';
import { graphQLOptions } from './graphql-options';
import { PostService } from '../services/post-service';

export class GraphQLServer {
  private authenticationService: AuthenticationService;

  constructor() {
    this.authenticationService = new AuthenticationService(
      environment.dataServer.baseUrl,
      environment.dataServer.clientInfo
    );
  }

  async start(): Promise<{ url: string }> {
    // The ApolloServer constructor requires two parameters: your schema
    // definition and your set of resolvers.
    const server = new ApolloServer<GraphQLContext>(graphQLOptions);

    return startStandaloneServer(server, {
      listen: { port: environment.graphqlServer.port },
      context: async ({ req }) => ({
        authenticationService: this.authenticationService,
        postServiceProvider: (ctx) => new PostService(ctx, environment.dataServer.baseUrl, environment.dataServer.pageCount),
        cache: server.cache,
      }),
    });
  }
}
