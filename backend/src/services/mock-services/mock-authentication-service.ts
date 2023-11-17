import { AuthenticationService } from '../authentication-service';

/**
 * Mocks AuthenticationService by adding feature to set and reset the token expiration.
 * Used for testing cases when short-lieved token is expired.
 */
export class MockAuthenticationService extends AuthenticationService {
  static readonly EXPIRED_TOKEN = 'Some invalid token';

  public isExpired = false;
  public totalCallCount = 0;
  public retryCountAfterExpired = 0;
  private tokenProvider: () => Promise<string>;

  /**
   * Creates the MockAuthenticationService
   * @param tokenProvider  A function or AuthenticationService that returns token.
   * @param makeExpired A function that decides whether to force the current token be expired. 
   * @param canResetToken A function that decides whether the expired token can be renewed.
   */
  constructor(
    tokenProvider: AuthenticationService | (() => Promise<string>),
    private makeExpired?: () => boolean,
    private canResetToken?: (retryCountAfterExpired: number) => boolean
  ) {
    super(null, null);
    this.tokenProvider =
      tokenProvider instanceof AuthenticationService ? () => tokenProvider.getToken() : tokenProvider;
  }

  getToken(): Promise<string> {
    ++this.totalCallCount;
    if (this.isExpired) {
      if (this.canResetToken && this.canResetToken(++this.retryCountAfterExpired)) {
        this.isExpired = false;
      }
    } else {
      this.isExpired = this.makeExpired && this.makeExpired();
    }

    return this.isExpired ? Promise.resolve(MockAuthenticationService.EXPIRED_TOKEN) : this.tokenProvider();
  }
}
