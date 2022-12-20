import { logger } from '../utils/logger';
import { BackendError } from '../utils/backend-error';
import { AbstractGraphQLClient, Query, Variables } from './abstract-graphql-client';

/**
 * Provides services for fetching data from GraphQL Server.
 */
export class GraphQLClient extends AbstractGraphQLClient {
  /**
   * Create the service provider.
   * @param backendUrl The backend URL is specified every time because environement variable
   * process.env.XXX is invisible on the client side while using SWR.
   */
  constructor(protected backendUrl: string) {
    super();
  }

  // /**
  //  * Fetch the raw query data. This method can be overridden by child classes.
  //  * @param query
  //  * @param variables
  //  * @returns
  //  */
  // protected async fetchQuery<T>(
  //   query: Query,
  //   variables?: Variables
  // ): Promise<T> {
  //   return request<T>(this.backendUrl, query, variables).finally(() =>
  //     logger.debug('[GraphQL] Done.')
  //   );
  // }

  /**
   * Fetch the raw query data with the standard fetch API instead of
   * 'graphql-request' for better control.
   *
   * This method can be overridden by child classes.
   * @param query
   * @param variables
   * @returns
   */
  protected fetchQuery<T>(query: Query, variables?: Variables): Promise<T> {
    return fetch(this.backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const error = new BackendError(
            'An error occurred while fetching the data.',
            res.status,
            await res.json()
          );
          throw error;
        }
        return res.json(); // Promise<any>
      })
      .then((res: any) => res.data)
      .finally(() => logger.debug('[GraphQL] Done.'));
  }

}
