import { ApolloServer } from '@apollo/server';
import { environment } from '../../../src/environment/environment';
import { AuthenticationService } from '../../../src/services/authentication-service';
import { PostService } from '../../../src/services/post-service';
import { GraphQLContext } from '../../../src/graphql/graphql-context';
import { GRAPHQL_OPTIONS } from '../../../src/graphql/graphql-options';
import { Utils } from '../../../src/utils/utils';
import { User } from '../../client/models/user';
import { Kind } from 'graphql';
import { MockGraphQLClient } from '../../helper/mock-graphql-client';
import { KeyValueCache } from '@apollo/utils.keyvaluecache';

const MAX_POST_COUNT = 1000;

/**
 * Test cases
 */
describe('GraphQLServer (e2e test)', () => {
  let graphqlClient: MockGraphQLClient;

  beforeAll(() => {
    const { baseUrl, clientInfo, pageCount } = environment.dataServer;
    expect(baseUrl).toBeTruthy();
    expect(clientInfo).toBeTruthy();
    expect(pageCount).toBeTruthy();
    expect(pageCount).not.toBeNaN();

    const server = new ApolloServer<GraphQLContext>(GRAPHQL_OPTIONS);
    const executionOptions = {
      contextValue: {
        authenticationService: new AuthenticationService(baseUrl, clientInfo),
        postServiceProvider: (authenticationService: AuthenticationService, cache?: KeyValueCache) =>
          new PostService(
            environment.dataServer.baseUrl,
            authenticationService,
            cache,
            environment.dataServer.pageCount
          ),
        cache: server.cache,
      },
    };

    graphqlClient = new MockGraphQLClient(server, executionOptions);
  });

  // after the tests we'll stop the server
  afterAll(async () => {
    await graphqlClient.stopServer();
  });

  beforeEach(() => {
    jest.setTimeout(60000);
  });

  describe('Fetch posts', () => {
    test('fetch random page', async () => {
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
    });

    test('fetch random page', async () => {
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
    });

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

test('Test custom scalar resolvers', () => {
  const dateScalarDefinition = GRAPHQL_OPTIONS.resolvers.Date;
  const date = new Date();
  const dateValue = date.valueOf();

  expect(date.getTime()).toBe(dateValue);
  expect(dateScalarDefinition.serialize(date)).toBe(dateValue);
  expect(dateScalarDefinition.parseValue(dateValue)).toStrictEqual(date);
  expect(
    dateScalarDefinition.parseLiteral({
      kind: Kind.INT,
      value: dateValue.toString(),
    })
  ).toStrictEqual(date);
  expect(dateScalarDefinition.parseLiteral({ kind: Kind.BOOLEAN, value: true })).toBeNull();
});
