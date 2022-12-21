import { ApolloServer } from '@apollo/server';
import { VariableValues } from '@apollo/server/dist/esm/externalTypes/graphql';
import assert from 'assert';
import { DocumentNode } from 'graphql';
import { GraphQLContext } from '../../src/graphql/graphql-context';
import { AbstractGraphQLClient } from '../client/services/abstract-graphql-client';

export class MockGraphQLClient extends AbstractGraphQLClient {
  constructor(private server: ApolloServer<GraphQLContext>, private context: GraphQLContext) {
    super();
  }

  protected fetchQuery<T>(query: string | DocumentNode, variables?: VariableValues): Promise<T> {
    return this.server
      .executeOperation<T>(
        {
          query,
          variables,
        },
        { contextValue: this.context }
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
    return this.server.stop();
  }
}
