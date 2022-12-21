import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { AuthenticationService } from '../services/authentication-service';
import { environment } from '../environment/environment';
import { GraphQLContext } from './graphql-context';
import { PostService } from '../services/post-service';
import { KeyValueCache } from '@apollo/utils.keyvaluecache';
import { GRAPHQL_RESOLVERS } from './graphql-resolvers';
import { GRAPHQ_SCHEMA } from './graphql-schema';

export class GraphQLServer {
  public readonly apolloServer: ApolloServer<GraphQLContext>;
  public readonly context: GraphQLContext;

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

    if (!authenticationService) {
      authenticationService = new AuthenticationService(
        environment.dataServer.baseUrl,
        environment.dataServer.clientInfo
      );
    }

    if (!postServiceBuilder) {
      postServiceBuilder = (authenticationService: AuthenticationService, cache?: KeyValueCache) =>
        new PostService(environment.dataServer.baseUrl, authenticationService, cache, environment.dataServer.pageCount);
    }

    this.context = {
      authenticationService,
      postServiceBuilder,
      cache: this.apolloServer.cache,
    };
  }

  async startStandaloneServer(): Promise<{ url: string }> {
    return startStandaloneServer(this.apolloServer, {
      listen: { port: environment.graphqlServer.port },
      context: async () => this.context,
    });
  }

  stopServer(): Promise<void> {
    return this.apolloServer.stop();
  }
}
