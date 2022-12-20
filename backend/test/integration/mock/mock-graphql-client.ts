import { ApolloServer } from "@apollo/server";
import { ExecuteOperationOptions, VariableValues } from "@apollo/server/dist/esm/externalTypes/graphql";
import assert from "assert";
import { DocumentNode } from "graphql";
import { GraphQLContextEx } from "../../../src/graphql/graphql-context";
import { AbstractGraphQLClient } from "../../client/services/abstract-graphql-client";

export class MockGraphQLClient extends AbstractGraphQLClient {

  constructor(private server: ApolloServer<GraphQLContextEx>,
    private executionOptions: ExecuteOperationOptions<GraphQLContextEx>,
  ) {
    super();
  }


  protected fetchQuery<T>(query: string | DocumentNode, variables?: VariableValues): Promise<T> {
    return this.server
    .executeOperation<T>(
      {
        query,
        variables,
      },
      this.executionOptions
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