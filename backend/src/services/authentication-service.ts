import { RESTDataSource } from '@apollo/datasource-rest';
import { AccessToken } from '../models/access-token';
import { ClientInfo } from '../models/client-info';
import { logger } from '../utils/logger';

export class AuthenticationService extends RESTDataSource {
  private token$?: Promise<string>;

  constructor(public baseURL: string, private clientInfo: ClientInfo) {
    super();
    this.memoizeGetRequests = false;
  }

  async getToken(): Promise<string> {
    return this.token$ ? this.token$ : this.forceRefreshToken();
  }

  async forceRefreshToken(): Promise<string> {
    logger.info('Refreshing token');

    this.token$ = this.post<AccessToken>('register', {
      body: this.clientInfo,
    }).then((accessToken) => accessToken.sl_token);
    
    return this.token$;
  }
}
