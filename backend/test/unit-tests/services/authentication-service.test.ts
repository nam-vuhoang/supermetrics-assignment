import { GraphQLError } from 'graphql';
import { environment } from '../../../src/environment/environment';
import { AuthenticationService } from '../../../src/services/authentication-service';
import { delay } from '../../helper/test-utils';

describe('AuthenticationService', () => {
  const { baseUrl, clientInfo } = environment.dataServer;
  test('environment variables', () => {
    expect(baseUrl).toEqual('https://api.supermetrics.com/assignment');
    expect(clientInfo).toBeTruthy();
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

    // await and notify expiration
    await delay(AuthenticationService.MIN_TOKEN_EXPIRATION_DURATION_IN_MILLISECONDS);
    await expect(authenticationService.getToken()).resolves.toBe(token); // tokens are same
    authenticationService.notifyTokenExpired();
    await expect(authenticationService.getToken()).resolves.not.toBe(token); // tokens are NOT same
  });

  test('wrong baseUrl', async () => {
    const authenticationService = new AuthenticationService(baseUrl + 'a', clientInfo);
    const rejects = await expect(authenticationService.getToken()).rejects;
    rejects.toBeInstanceOf(GraphQLError);
    // rejects.m
  });
});
