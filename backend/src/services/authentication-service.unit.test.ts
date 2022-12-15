import { GraphQLError } from 'graphql';
import { environment } from '../environment/environment';
import { AuthenticationService } from './authentication-service';
import { delay } from '../../test/helper/test-utils';
import { StatusCodes } from 'http-status-codes';

describe('Class AuthenticationService', () => {
  const { baseUrl, clientInfo } = environment.dataServer;

  beforeAll(() => {
    expect(baseUrl).toBeTruthy();
    expect(clientInfo).toBeTruthy();
    expect(clientInfo.client_id).toBeTruthy();
  });

  test('get token', async () => {
    const authenticationService = new AuthenticationService(baseUrl, clientInfo);
    const token = await authenticationService.getToken();
    expect(token).toBeTruthy();
    expect(token.length).toBeGreaterThan(0);
  });

  test('get token expired', async () => {
    const authenticationService = new AuthenticationService(baseUrl, clientInfo);
    const token = await authenticationService.getToken();

    // notify expiration
    authenticationService.notifyTokenExpired();
    await expect(authenticationService.getToken()).resolves.toBe(token); // tokens are same

    // await and notify expiration
    await delay(AuthenticationService.MIN_TOKEN_EXPIRATION_DURATION_IN_MILLISECONDS);
    await expect(authenticationService.getToken()).resolves.toBe(token); // tokens are same

    authenticationService.notifyTokenExpired();
    await expect(authenticationService.getToken()).resolves.not.toBe(token); // tokens are NOT same
  });

  test('wrong baseUrl => 404', async () => {
    expect.assertions(2);
    try {
      const authenticationService = new AuthenticationService('http://blabla.com', clientInfo);
      await authenticationService.getToken();
    } catch (e) {
      expect(e).toBeInstanceOf(GraphQLError);
      const { response } = (<GraphQLError>e).extensions;
      expect((<any>response).status).toBe(StatusCodes.NOT_FOUND); // 404 - Not Found
    }
  });

  test('wrong clientInfo => 400', async () => {
    expect.assertions(2);
    try {
      const authenticationService = new AuthenticationService(baseUrl, { ...clientInfo, client_id: 'blabla' });
      await authenticationService.getToken();
    } catch (e) {
      expect(e).toBeInstanceOf(GraphQLError);
      const { response } = (<GraphQLError>e).extensions;
      expect((<any>response).status).toBe(StatusCodes.BAD_REQUEST); // 400 - Bad Request
    }
  });
});
