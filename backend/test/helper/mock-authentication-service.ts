import { AuthenticationService } from '../../src/services/authentication-service';

export class MockAuthenticationService extends AuthenticationService {
  static readonly EXPIRED_TOKEN = 'Some invalid token';

  public isExpired = false;
  public totalCallCount = 0;
  public retryCountAfterExpired = 0;
  private tokenProvider: () => Promise<string>;

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
      if (this.canResetToken(++this.retryCountAfterExpired)) {
        this.isExpired = false;
      }
    } else {
      this.isExpired = this.makeExpired && this.makeExpired();
    }

    return this.isExpired ? Promise.resolve(MockAuthenticationService.EXPIRED_TOKEN) : this.tokenProvider();
  }
}
