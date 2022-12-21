import { GraphQLError } from 'graphql';
import { environment } from '../environment/environment';
import { AuthenticationService } from './authentication-service';
import { delay } from '../../test/helper/test-utils';
import { StatusCodes } from 'http-status-codes';

const FAKE_BASE_URL = 'http://blabla.com';
const FAKE_CLIENT_ID = 'Is it me you are looking for?';

/**
 * Test AuthenticationService
 */
describe('Class AuthenticationService', () => {
  const { baseUrl, clientInfo } = environment.dataServer;

  beforeAll(() => {
    expect(baseUrl).toBeTruthy();
    expect(clientInfo).toBeTruthy();
    expect(clientInfo.client_id).toBeTruthy();
  });

  it('should get token from the real data server', async () => {
    const authenticationService = new AuthenticationService(baseUrl, clientInfo);
    const token = await authenticationService.getToken();
    expect(token).toBeTruthy();
    expect(token.length).toBeGreaterThan(0);
  });

  it('should get a new token after expiration', async () => {
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

  it('should return 404 if wrong baseUrl', async () => {
    expect.assertions(2);
    try {
      const authenticationService = new AuthenticationService(FAKE_BASE_URL, clientInfo);
      await authenticationService.getToken();
    } catch (e) {
      expect(e).toBeInstanceOf(GraphQLError);
      const { response } = (<GraphQLError>e).extensions;
      expect((<any>response).status).toBe(StatusCodes.NOT_FOUND); // 404 - Not Found
    }
  });

  it('should return 400 if wrong clientInfo', async () => {
    expect.assertions(2);
    try {
      const authenticationService = new AuthenticationService(baseUrl, { ...clientInfo, client_id: FAKE_CLIENT_ID });
      await authenticationService.getToken();
    } catch (e) {
      expect(e).toBeInstanceOf(GraphQLError);
      const { response } = (<GraphQLError>e).extensions;
      expect((<any>response).status).toBe(StatusCodes.BAD_REQUEST); // 400 - Bad Request
    }
  });
});
