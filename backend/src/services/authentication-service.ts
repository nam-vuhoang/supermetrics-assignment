import { RESTDataSource } from '@apollo/datasource-rest';
import { AccessToken } from '../models/access-token';
import { ClientInfo } from '../models/client-info';
import { HttpResponse } from '../models/http-response';
import { logger } from '../utils/logger';

export class AuthenticationService extends RESTDataSource {
  static readonly REQUEST_PATH = 'register';

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

    this.token$ = this.post<HttpResponse<AccessToken>>(AuthenticationService.REQUEST_PATH, {
      body: this.clientInfo,
    })
      .then((response) => response.data)
      .then((data) => {
        const token = data.sl_token;
        logger.debug('New token received: %s', token);
        return token;
      });

    return this.token$;
  }
}
