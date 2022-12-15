import { ApolloServer } from '@apollo/server';
import { ExecuteOperationOptions } from '@apollo/server/dist/esm/externalTypes/graphql';
import { assert } from 'console';
import gql from 'graphql-tag';
import { environment } from '../environment/environment';
import { AuthenticationService } from '../services/authentication-service';
import { PostService } from '../services/post-service';
import { GraphQLContext } from './graphql-context';
import { graphQLOptions } from './graphql-options';

describe('GraphQLServer', () => {
  let server: ApolloServer<GraphQLContext>;
  let executionOptions: ExecuteOperationOptions<GraphQLContext>;

  beforeAll(() => {
    const { baseUrl, clientInfo, pageCount } = environment.dataServer;
    expect(baseUrl).toBeTruthy();
    expect(clientInfo).toBeTruthy();
    expect(pageCount).toBeTruthy();
    expect(pageCount).not.toBeNaN();

    server = new ApolloServer<GraphQLContext>(graphQLOptions);

    const authenticationService = new AuthenticationService(baseUrl, clientInfo);
    executionOptions = {
      contextValue: {
        authenticationService,
        postServiceProvider: (ctx) =>
          new PostService(ctx, environment.dataServer.baseUrl, environment.dataServer.pageCount),
        cache: server.cache,
      },
    };
  });

  // after the tests we'll stop the server
  afterAll(async () => {
    await server?.stop();
  });

  test('test server', async () => {
    const response = await server.executeOperation<String>(
      {
        query: gql`
          query {
            __typename
          }
        `,
      },
      executionOptions
    );

    const { body } = response;
    assert(body.kind === 'single');

    const { singleResult } = <any>body;

    expect(singleResult.errors).toBeUndefined();
    expect(singleResult.data?.__typename).toBe('Query');
  });
});
