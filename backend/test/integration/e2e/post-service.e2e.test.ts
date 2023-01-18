import { GraphQLError } from 'graphql';
import { StatusCodes } from 'http-status-codes';
import { environment } from '../../../src/environment/environment';
import { AuthenticationService } from '../../../src/services/authentication-service';
import { PostService } from '../../../src/services/post-service';
import { Utils } from '../../../src/utils/utils';
import { MockAuthenticationService } from '../../helper/mock-authentication-service';

const MAX_POST_COUNT = 1000;
const FAKE_USER_ID = 'this user doesnt exist';

/**
 * Tests chain: (AuthenticationService+PostService) >> external data server.
 */
describe('PostService (e2e test)', () => {
  const { baseUrl, clientInfo, pageCount } = environment.dataServer;
  let authenticationService: AuthenticationService;
  let postService: PostService;

  beforeAll(() => {
    expect(baseUrl).toBeTruthy();
    expect(clientInfo).toBeTruthy();
    expect(pageCount).toBeTruthy();
    expect(pageCount).not.toBeNaN();

    authenticationService = new AuthenticationService(baseUrl, clientInfo);
    postService = new PostService(baseUrl, authenticationService, undefined, pageCount);
    expect(postService.baseURL).toBe(baseUrl);
  });

  test('Fetch blog with all data', async () => {
    for (let i = 0; i < 10; ++i) {
      // filter with user ID every second test
      const userId = i % 2 == 0 ? `user_${Utils.getRandomInt(30)}` : undefined;

      const size = (Utils.getRandomInt(10) + 1) * 100;
      const index = Utils.getRandomInt(20);
      const blog = await postService.fetchBlog({ userId, page: { index, size } });

      expect(blog.posts.length).toBe(blog.size);

      if (userId) {
        expect(blog.size).toBeGreaterThanOrEqual(0);
        expect(blog.totalPostCount).toBeGreaterThanOrEqual(0);
        expect(blog.totalPostCount).toBeLessThan(MAX_POST_COUNT);
      } else {
        const expectedSize = Math.min(size, Math.max(MAX_POST_COUNT - size * index, 0));
        expect(blog.size).toBe(expectedSize);
        expect(blog.totalPostCount).toBe(MAX_POST_COUNT);
      }

      const hasPosts = blog.size > 0;
      const authors = blog.authors();
      if (hasPosts) {
        if (userId) {
          expect(authors.length).toBe(1);
        } else {
          expect(authors.length).toBeGreaterThan(0);
          expect(authors.length).toBeLessThanOrEqual(size);
        }
      } else {
        expect(authors.length).toBe(0);
      }

      for (let author of authors) {
        if (userId) {
          expect(author.userId).toBe(userId);
        }

        const stats = author.stats();
        expect(stats.minLength).toBeGreaterThan(0);
        expect(stats.averageLength).toBeGreaterThanOrEqual(stats.minLength);
        expect(stats.maxLength).toBeGreaterThanOrEqual(stats.averageLength);
        expect(stats.totalCount).toBeGreaterThan(0);

        // check uniqueness
        expect(new Set(stats.frequencies.map((f) => f.month.valueOf())).size).toBe(stats.frequencies.length);
        expect(Utils.getArraySum(stats.frequencies.map((f) => f.count))).toBe(stats.totalCount);
      }

      const blog2 = await postService.fetchBlog({ userId, page: { index, size } }); // similar request
      expect(blog2).toStrictEqual(blog);
    }
  });

  test('Fetch users', async () => {
    const users = await postService.fetchUsers();
    expect(users.length).toBeGreaterThan(0);

    // check uniqueness
    expect(new Set(users.map((u) => u.userId)).size).toBe(users.length);

    for (let user of users) {
      expect(user.stats).toBeFalsy();
    }
  });
});

describe('Class PostSerivce (with mock services)', () => {
  const { baseUrl, clientInfo, pageCount } = environment.dataServer;

  beforeAll(() => {
    expect(baseUrl).toBeTruthy();
    expect(baseUrl).toStrictEqual('https://api.supermetrics.com/assignment');
    expect(clientInfo).toBeTruthy();
    expect(pageCount).toBeTruthy();
    expect(pageCount).not.toBeNaN();
  });

  test('When token is expired forever', async () => {
    const authenticationService = new MockAuthenticationService(
      new AuthenticationService(baseUrl, clientInfo),
      () => true, // expire now
      () => false // never reset
    );
    const postService = new PostService(baseUrl, authenticationService, undefined, pageCount);

    try {
      await postService.fetchBlog({ userId: FAKE_USER_ID });
      expect(false).toBe(true); // should not reach this place
    } catch (e) {
      expect(e).toBeInstanceOf(GraphQLError);
      const { response } = (<GraphQLError>e).extensions;
      expect((<any>response).status).toBe(StatusCodes.UNAUTHORIZED); // 401
      expect(authenticationService.retryCountAfterExpired).toBeGreaterThanOrEqual(
        PostService.MAX_RETRY_COUNT_IF_UNAUTHORIZED
      );
    }
  });

  test('When token is expired and reset after 2 retrials', async () => {
    const authenticationService = new MockAuthenticationService(
      new AuthenticationService(baseUrl, clientInfo),
      () => true, // expire now
      (retryCountAfterExpired) => retryCountAfterExpired % 2 === 0 // reset next time
    );
    expect(await authenticationService.getToken()).toStrictEqual(MockAuthenticationService.EXPIRED_TOKEN);

    const postService = new PostService(baseUrl, authenticationService, undefined, pageCount);
    expect(postService.baseURL).toStrictEqual(baseUrl);

    await postService.fetchBlog({ userId: FAKE_USER_ID });
    expect(authenticationService.retryCountAfterExpired).toBe(pageCount * 2);
  });
});
