import { RESTDataSource } from '@apollo/datasource-rest';
import { AccessToken } from '../models/access-token';
import { ClientInfo } from '../models/client-info';
import { HttpResponse } from '../models/http-response';
import { logger } from '../utils/logger';

/**
 * Authentication service. Responsible for querying token from the data server.
 * Uses parent RESTDataSource methods for executing HTTP requests.
 */
export class AuthenticationService extends RESTDataSource {
  private static readonly REQUEST_PATH = 'register';
  static readonly MIN_TOKEN_EXPIRATION_DURATION_IN_MILLISECONDS = 3000; // 3 secs

  /**
   * Cache for the last loaded token.
   */
  private token$?: Promise<string>;

  /**
   * Time when token last updated.
   */
  private tokenUpdatedTime?: number;

  /**
   * Flag indicating if token was mark as expired.
   */
  private isTokenExpired: boolean;

  /**
   * Create a parent RESTDatasource.
   * @param baseURL 
   * @param clientInfo 
   */
  constructor(public baseURL: string, private clientInfo: ClientInfo) {
    super();
  }

  /**
   * Returns the cached token if it exists and it is not marked as expired,
   * otherwise send the ClientInfo to the data server for querying a new token.
   * @returns 
   */
  async getToken(): Promise<string> {
    if (!this.token$ || this.isTokenExpired) {
      logger.debug('Refreshing token');

      this.token$ = this.post<HttpResponse<AccessToken>>(AuthenticationService.REQUEST_PATH, {
        body: this.clientInfo,
      }).then((response) => response.data.sl_token);

      this.tokenUpdatedTime = Date.now();
      this.isTokenExpired = false;
    }

    return this.token$;
  }

  /**
   * Mark the token as expired if the token duration is more than the minimum expiration time.
   * This method is used by PostService after failed getting Unauthorized error from the data attempt. 
   */
  notifyTokenExpired(): void {
    // wait at least a certain period before refreshing token
    const tokenDuration = Date.now() - this.tokenUpdatedTime;
     this.isTokenExpired ||= tokenDuration > AuthenticationService.MIN_TOKEN_EXPIRATION_DURATION_IN_MILLISECONDS;
  }
}
