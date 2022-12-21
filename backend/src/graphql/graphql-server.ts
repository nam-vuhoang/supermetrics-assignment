import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { AuthenticationService } from '../services/authentication-service';
import { environment } from '../environment/environment';
import { GraphQLContext } from './graphql-context';
import { GRAPHQL_OPTIONS } from './graphql-options';
import { PostService } from '../services/post-service';
import { KeyValueCache } from '@apollo/utils.keyvaluecache';

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
    const server = new ApolloServer<GraphQLContext>(GRAPHQL_OPTIONS);

    return startStandaloneServer(server, {
      listen: { port: environment.graphqlServer.port },
      context: async ({ req }) => ({
        authenticationService: this.authenticationService,
        postServiceBuilder: (authenticationService: AuthenticationService, cache?: KeyValueCache) =>
          new PostService(
            environment.dataServer.baseUrl,
            authenticationService,
            cache,
            environment.dataServer.pageCount
          ),
        cache: server.cache,
      }),
    });
  }
}
