import { VariableValues } from '@apollo/server/dist/esm/externalTypes/graphql';
import assert from 'assert';
import { DocumentNode } from 'graphql';
import { GraphQLServer } from '../../src/graphql/graphql-server';
import { AbstractGraphQLClient } from '../client/services/abstract-graphql-client';

/**
 * A mock GraphQLClient that connects to a specified GraphQLServer for querying data.
 * Inherits query functions from AbstractGraphQLClient.
 */
export class MockGraphQLClient extends AbstractGraphQLClient {
  constructor(private server: GraphQLServer) {
    super();
  }

  /**
   * Fetch the raw query directly from the GraphQL server.
   * @param query 
   * @param variables 
   * @returns 
   */
  protected fetchQuery<T>(query: string | DocumentNode, variables?: VariableValues): Promise<T> {
    return this.server.apolloServer
      .executeOperation<T>(
        {
          query,
          variables,
        },
        { contextValue: this.server.context }
      )
      .then((response) => {
        const { body } = response;
        assert(body.kind === 'single');

        const { singleResult } = <any>body;
        if (singleResult.errors) {
          throw singleResult.errors;
        }

        return singleResult.data as T;
      });
  }

  stopServer(): Promise<void> {
    return this.server.stopServer();
  }
}
