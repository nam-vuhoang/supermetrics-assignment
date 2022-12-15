import exp from 'constants';
import { environment } from '../environment/environment';
import { GraphQLContext } from '../graphql/graphql-context';
import { Utils } from '../utils/utils';
import { AuthenticationService } from './authentication-service';
import { PostService } from './post-service';

const MAX_POST_COUNT = 1000;

describe('Class PostService', () => {
  const { baseUrl, clientInfo, pageCount } = environment.dataServer;
  let authenticationService: AuthenticationService;
  let postService: PostService;

  beforeAll(() => {
    expect(baseUrl).toBeTruthy();
    expect(clientInfo).toBeTruthy();
    expect(pageCount).toBeTruthy();
    expect(pageCount).not.toBeNaN();

    authenticationService = new AuthenticationService(baseUrl, clientInfo);
    postService = new PostService({ authenticationService }, baseUrl, pageCount);
    expect(postService.baseURL).toBe(baseUrl);
  });

  test('Fetch blog with all data', async () => {
    for (let i = 0; i < 40; ++i) {
      // filter with user ID every second test
      const userId = i % 2 == 0 ? `user_${Utils.getRandomInt(30)}` : undefined;

      const size = (Utils.getRandomInt(5) + 1) * 300;
      const index = Utils.getRandomInt(pageCount);
      const blog = await postService.fetchPosts({ userId, page: { index, size } });

      expect(blog.posts.length).toBe(blog.size);

      if (userId) {
        expect(blog.size).toBeGreaterThanOrEqual(0);
      } else {
        const expectedSize = Math.min(size, Math.max(MAX_POST_COUNT - size * index, 0));
        expect(blog.size).toBe(expectedSize);
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

      const blog2 = await postService.fetchPosts({ userId, page: { index, size } }); // similar request
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

  test('When token is expired', () => {
    class MockAuthenticationSerice extends AuthenticationService {
      public isExpired = false;
      public callCountAfterExpired = 0;

      getToken(): Promise<string> {
        this.isExpired ||= Utils.getRandomInt(10) % 3 == 0;
        if (this.isExpired) {          
        }
        return super.getToken();
      }
    }

    class MockPostService extends PostService {
      
    }
  });
});
