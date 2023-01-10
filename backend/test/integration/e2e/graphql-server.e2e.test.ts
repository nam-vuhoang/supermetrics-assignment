import { environment } from '../../../src/environment/environment';
import { Utils } from '../../../src/utils/utils';
import { User } from '../../client/models/user';
import { MockGraphQLClient } from '../../helper/mock-graphql-client';
import { GraphQLServer } from '../../../src/graphql/graphql-server';

const MAX_POST_COUNT = 1000;
const MAX_TIMEOUT = 300000; // 5 mins

/**
 * Tests end-to-end chain: MockGraphQLClient >> GraphQLServer >> (AuthenticationService+PostService)
 * >> external data server.
 */
describe('GraphQLServer (e2e test)', () => {
  let graphqlClient: MockGraphQLClient;

  beforeAll(() => {
    const { baseUrl, clientInfo, pageCount } = environment.dataServer;
    expect(baseUrl).toBeTruthy();
    expect(clientInfo).toBeTruthy();
    expect(pageCount).toBeTruthy();
    expect(pageCount).not.toBeNaN();

    graphqlClient = new MockGraphQLClient(new GraphQLServer());
  });

  // after the tests we'll stop the server
  afterAll(async () => {
    await graphqlClient.stopServer();
  });

  describe('Fetch posts', () => {
    test('fetch random page 1', async () => {
      for (let i = 0; i < 5; ++i) {
        // filter with user ID every second test
        const userId = undefined;

        const pageSize = (Utils.getRandomInt(10) + 1) * 20;
        const pageIndex = Utils.getRandomInt(20);

        const blog = await graphqlClient.fetchPosts({ pageIndex, pageSize, userId });
        expect(blog).toBeTruthy();
        expect(blog.posts.length).toBeLessThanOrEqual(pageSize);

        const expectedSize = Math.min(pageSize, Math.max(MAX_POST_COUNT - pageSize * pageIndex, 0));
        expect(blog.totalPostCount).toBe(MAX_POST_COUNT);
      }
    }, MAX_TIMEOUT);

    test('fetch random page 2', async () => {
      for (let i = 0; i < 5; ++i) {
        const userId = `user_${Utils.getRandomInt(30)}`;

        const pageSize = (Utils.getRandomInt(10) + 1) * 20;
        const pageIndex = Utils.getRandomInt(20);

        const blog = await graphqlClient.fetchPosts({ pageIndex, pageSize, userId });
        expect(blog).toBeTruthy();
        expect(blog.posts.length).toBeLessThanOrEqual(pageSize);
        expect(blog.totalPostCount).toBeGreaterThanOrEqual(0);
        expect(blog.totalPostCount).toBeLessThan(MAX_POST_COUNT);

        for (let post of blog.posts) {
          expect(post.userId).toBe(userId);
        }
      }
    }, MAX_TIMEOUT);

    test('fetch posts from non-existing user', async () => {
      const pageSize = 100;
      const blog = await graphqlClient.fetchPosts({ pageIndex: 0, pageSize, userId: 'blabla' });
      expect(blog).toBeTruthy();
    });
  });

  describe('Fetch users', () => {
    test('fetch all user stats', async () => {
      const users: User[] = await graphqlClient.fetchFullStats();
      expect(users.length).toBeGreaterThan(0);

      for (let user of users) {
        const { stats } = user;
        expect(stats).not.toBeUndefined();
        expect(stats.minLength).toBeGreaterThan(0);
        expect(stats.averageLength).toBeGreaterThanOrEqual(stats.minLength);
        expect(stats.maxLength).toBeGreaterThanOrEqual(stats.averageLength);
        expect(stats.totalCount).toBeGreaterThan(0);

        // check uniqueness
        expect(new Set(stats.frequencies.map((f) => f.month.valueOf())).size).toBe(stats.frequencies.length);
        expect(Utils.getArraySum(stats.frequencies.map((f) => f.count))).toBe(stats.totalCount);
      }
    });

    test('fetch single user stats', async () => {
      const userId = 'user_1';
      const users: User[] = await graphqlClient.fetchFullStats({ userId });
      expect(users.length).toBeGreaterThan(0);

      for (let user of users) {
        expect(user.userId === userId);
        const { stats } = user;
        expect(stats).not.toBeUndefined();
        expect(stats.minLength).toBeGreaterThan(0);
        expect(stats.averageLength).toBeGreaterThanOrEqual(stats.minLength);
        expect(stats.maxLength).toBeGreaterThanOrEqual(stats.averageLength);
        expect(stats.totalCount).toBeGreaterThan(0);

        // check uniqueness
        expect(new Set(stats.frequencies.map((f) => f.month.valueOf())).size).toBe(stats.frequencies.length);
        expect(Utils.getArraySum(stats.frequencies.map((f) => f.count))).toBe(stats.totalCount);
      }
    });

    test('fetch all user IDs', async () => {
      const users: string[] = await graphqlClient.fetchUserIds();
      expect(users.length).toBeGreaterThan(0);
    });
  });
});
