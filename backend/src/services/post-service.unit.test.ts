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
    for (let i = 0; i < 10; ++i) {
      // filter with user ID every second test
      const userId = i % 2 == 0 ? `user_${Utils.getRandomInt(40)}` : undefined;

      const size = (Utils.getRandomInt(5) + 1) * 300;
      const index = Utils.getRandomInt(pageCount);
      const blog = await postService.fetchPosts( {userId, page: { index, size } });

      expect(blog.posts.length).toBe(blog.size);
      
      if (userId) {
        expect(blog.size).toBe(Math.min(size, MAX_POST_COUNT - size * index));
      } else {
        expect(blog.size).toBeGreaterThanOrEqual(0);
      }
      
      const authors = blog.authors();
      if (userId) {
        expect(authors.length).toBe(blog.size > 0 ? 1 : 0);
      } else {
        expect(authors.length).toBeGreaterThan(0);
        expect(authors.length).toBeLessThanOrEqual(size);
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
        expect(Utils.getArraySum(stats.frequencies.map(f => f.count))).toBe(stats.totalCount);
      }

      const blog2 = await postService.fetchPosts({userId, page: { index, size } }); // similar request
      expect(blog2).toBe(blog);
    }
  });

  // test('When token is expired', () => {
  //   class fakeAuthenticationSerice
  // });
});
