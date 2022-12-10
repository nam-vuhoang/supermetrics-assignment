import { RESTDataSource } from '@apollo/datasource-rest';
import { timeStamp } from 'console';
import { AccessToken } from '../models/access-token';
import { ClientInfo } from '../models/client-info';
import { HttpResponse } from '../models/http-response';
import { logger } from '../utils/logger';

export class AuthenticationService extends RESTDataSource {
  static readonly REQUEST_PATH = 'register';

  private token$?: Promise<string>;
  private isTokenExpired?: boolean;

  constructor(public baseURL: string, private clientInfo: ClientInfo) {
    super();
  }

  async getToken(): Promise<string> {
    if (!this.token$ || this.isTokenExpired) {
      logger.debug('Refreshing token');

      this.token$ = this.post<HttpResponse<AccessToken>>(AuthenticationService.REQUEST_PATH, {
        body: this.clientInfo,
      }).then((response) => response.data.sl_token);

      this.isTokenExpired = false;
    }

    return this.token$;
  }

  notifyTokenExpired(): void {
    this.isTokenExpired = true;
  }
}
