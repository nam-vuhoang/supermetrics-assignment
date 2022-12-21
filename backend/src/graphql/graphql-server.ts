import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { AuthenticationService } from '../services/authentication-service';
import { environment } from '../environment/environment';
import { GraphQLContext } from './graphql-context';
import { PostService } from '../services/post-service';
import { KeyValueCache } from '@apollo/utils.keyvaluecache';
import { GRAPHQL_RESOLVERS } from './graphql-resolvers';
import { GRAPHQ_SCHEMA } from './graphql-schema';

/**
 * ApolloServer's creator and wrapper.
 */
export class GraphQLServer {
  public readonly apolloServer: ApolloServer<GraphQLContext>;
  public readonly context: GraphQLContext;

  /**
   * Create ApolloServer and GraphQLContext for future execution.
   * @param authenticationService  The authorization service. If undefined, then GraphQLServer will create a default one.
   * @param postServiceBuilder The post service builder based the authentication service and KeyValueCache. If undefined, then GraphQLServer will create a default one.
   */
  constructor(
    authenticationService?: AuthenticationService,
    postServiceBuilder?: (authenticationService: AuthenticationService, cache?: KeyValueCache) => PostService
  ) {
    // The ApolloServer constructor requires two parameters: your schema
    // definition and your set of resolvers.
    this.apolloServer = new ApolloServer<GraphQLContext>({
      typeDefs: GRAPHQ_SCHEMA,
      resolvers: GRAPHQL_RESOLVERS,
    });

    // Create an AuthenticationService if undefined.
    if (!authenticationService) {
      authenticationService = new AuthenticationService(
        environment.dataServer.baseUrl,
        environment.dataServer.clientInfo
      );
    }

    // Create a PostService builder if undefined.
    if (!postServiceBuilder) {
      postServiceBuilder = (authenticationService: AuthenticationService, cache?: KeyValueCache) =>
        new PostService(environment.dataServer.baseUrl, authenticationService, cache, environment.dataServer.pageCount);
    }

    // Create the GraphQLContext for future use.
    this.context = {
      authenticationService,
      postServiceBuilder,
      cache: this.apolloServer.cache,
    };
  }

  /**
   * Start the ApolloServer as a standalone server on the port specified in the config file.
   * @returns 
   */
  async startStandaloneServer(): Promise<{ url: string }> {
    return startStandaloneServer(this.apolloServer, {
      listen: { port: environment.graphqlServer.port },
      context: async () => this.context,
    });
  }

  /**
   * Requests the ApolloServer to stop if it is running.
   * @returns 
   */
  stopServer(): Promise<void> {
    return this.apolloServer.stop();
  }
}
