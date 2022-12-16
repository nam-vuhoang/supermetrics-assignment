import { ApolloServer } from '@apollo/server';
import { ExecuteOperationOptions } from '@apollo/server/dist/esm/externalTypes/graphql';
import { environment } from '../../src/environment/environment';
import { AuthenticationService } from '../../src/services/authentication-service';
import { PostService } from '../../src/services/post-service';
import { GraphQLContextEx } from '../../src/graphql/graphql-context';
import { graphQLOptions } from '../../src/graphql/graphql-options';
import { fetchFullStats, fetchPosts, fetchUserIds, MAX_POST_COUNT } from './graphql-server.helper';
import { Utils } from '../../src/utils/utils';
import { User } from './models/user';
import { Kind } from 'graphql';

/**
 * Test cases
 */
describe('GraphQLServer', () => {
  let server: ApolloServer<GraphQLContextEx>;
  let executionOptions: ExecuteOperationOptions<GraphQLContextEx>;

  beforeAll(() => {
    const { baseUrl, clientInfo, pageCount } = environment.dataServer;
    expect(baseUrl).toBeTruthy();
    expect(clientInfo).toBeTruthy();
    expect(pageCount).toBeTruthy();
    expect(pageCount).not.toBeNaN();

    server = new ApolloServer<GraphQLContextEx>(graphQLOptions);

    const authenticationService = new AuthenticationService(baseUrl, clientInfo);
    executionOptions = {
      contextValue: {
        authenticationService,
        postServiceProvider: (ctx) =>
          new PostService(ctx, environment.dataServer.baseUrl, environment.dataServer.pageCount),
        cache: server.cache,
      },
    };
  });

  // after the tests we'll stop the server
  afterAll(async () => {
    await server?.stop();
  });

  describe('Fetch posts', () => {
    test('fetch random page', async () => {
      for (let i = 0; i < 5; ++i) {
        // filter with user ID every second test
        const userId = undefined;

        const pageSize = (Utils.getRandomInt(10) + 1) * 20;
        const pageIndex = Utils.getRandomInt(20);

        const blog = await fetchPosts(server, executionOptions, { pageIndex, pageSize, userId });
        expect(blog).toBeTruthy();
        expect(blog.posts.length).toBeLessThanOrEqual(pageSize);
        expect(blog.size).toBe(blog.posts.length);
        expect(blog.authors).toBeUndefined();

        const expectedSize = Math.min(pageSize, Math.max(MAX_POST_COUNT - pageSize * pageIndex, 0));
        expect(blog.size).toBe(expectedSize);
        expect(blog.totalPostCount).toBe(MAX_POST_COUNT);
      }
    });

    test('fetch random page', async () => {
      for (let i = 0; i < 5; ++i) {
        const userId = `user_${Utils.getRandomInt(30)}`;

        const pageSize = (Utils.getRandomInt(10) + 1) * 20;
        const pageIndex = Utils.getRandomInt(20);

        const blog = await fetchPosts(server, executionOptions, { pageIndex, pageSize, userId });
        expect(blog).toBeTruthy();
        expect(blog.posts.length).toBeLessThanOrEqual(pageSize);
        expect(blog.size).toBe(blog.posts.length);
        expect(blog.authors).toBeUndefined();

        expect(blog.size).toBeGreaterThanOrEqual(0);
        expect(blog.totalPostCount).toBeGreaterThanOrEqual(0);
        expect(blog.totalPostCount).toBeLessThan(MAX_POST_COUNT);

        for (let post of blog.posts) {
          expect(post.userId).toBe(userId);
        }
      }
    });

    test('fetch posts from non-existing user', async () => {
      const pageSize = 100;
      const blog = await fetchPosts(server, executionOptions, { pageIndex: 0, pageSize, userId: 'blabla' });
      expect(blog).toBeTruthy();
      expect(blog.size).toBe(0);
    });
  });

  describe('Fetch users', () => {
    test('fetch all user stats', async () => {
      const users: User[] = await fetchFullStats(server, executionOptions);
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
      const users: User[] = await fetchFullStats(server, executionOptions, userId);
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
      const users: string[] = await fetchUserIds(server, executionOptions);
      expect(users.length).toBeGreaterThan(0);
    });
  });
});

test('Test custom scalar resolvers', () => {
  const dateScalarDefinition = graphQLOptions.resolvers.Date;
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
