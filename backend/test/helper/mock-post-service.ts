import { GraphQLError } from 'graphql';
import { StatusCodes } from 'http-status-codes';
import { GraphQLContext } from '../../src/graphql/graphql-context';
import { PostService, RawPostData } from '../../src/services/post-service';
import { Post } from '../client/models/post';
import { MockAuthenticationService } from './mock-authentication-service';
import { PostGenerator } from './post-generator';

export class MockPostService extends PostService {
  private pages: Post[][];
  public mockAuthenticationService?: MockAuthenticationService;

  constructor(context: GraphQLContext, public baseURL: string, pageCount: number, pages?: Post[][]) {
    super(context, baseURL, pageCount);
    if (context.authenticationService && context.authenticationService instanceof MockAuthenticationService) {
      this.mockAuthenticationService = context.authenticationService;
    }
    this.pages = pages || PostGenerator.generatePostPages();
  }

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
      page: page,
      posts: this.pages[page - 1].map((p) => ({
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
