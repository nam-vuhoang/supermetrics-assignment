import { KeyValueCache } from '@apollo/utils.keyvaluecache';
import { GraphQLError } from 'graphql';
import { StatusCodes } from 'http-status-codes';
import { AuthenticationService } from '../../src/services/authentication-service';
import { PostService, RawPostData } from '../../src/services/post-service';
import { Post } from '../client/models/post';
import { MockAuthenticationService } from './mock-authentication-service';
import { PostGenerator } from './post-generator';

/**
 * The Mock PostSerivce for testing. Uses the linked MockAuthenticationService
 * (if defined) to check if the SL token is expired. Returns the mock page data
 * instead fetching from the data server.
 */
export class MockPostService extends PostService {
  private mockPages: Post[][];
  public mockAuthenticationService?: MockAuthenticationService;

  constructor(
    baseURL: string,
    authenticationService: AuthenticationService,
    cache: KeyValueCache | undefined,
    pageCount: number,
    mockPages?: Post[][],
    private returnWrongPage?: boolean
  ) {
    super(baseURL, authenticationService, cache, pageCount);
    if (authenticationService && authenticationService instanceof MockAuthenticationService) {
      this.mockAuthenticationService = authenticationService;
    }
    this.mockPages = mockPages || PostGenerator.generatePostPages();
  }

  /**
   * Returns the specified page from the mock pages.
   * @param pageNumber 
   * @param token 
   * @returns 
   */
  protected async internalFetchRawData(pageNumber: string, token: string): Promise<RawPostData> {
    if (this.mockAuthenticationService && this.mockAuthenticationService.isExpired) {
      throw new GraphQLError('Unauthorized', {
        extensions: {
          response: {
            status: StatusCodes.UNAUTHORIZED,
          },
        },
      });
    }

    const page = Number(pageNumber);

    return Promise.resolve({
      page: !this.returnWrongPage ? page : page - 1,
      posts: this.mockPages[page - 1].map((p) => ({
        id: p.id,
        from_id: p.userId,
        from_name: p.userName,
        message: p.message,
        type: p.type,
        created_time: new Date(p.createdTime).toISOString(),
      })),
    });
  }
}
