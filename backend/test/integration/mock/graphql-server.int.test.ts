import { environment } from '../../../src/environment/environment';
import { Utils } from '../../../src/utils/utils';
import { User } from '../../client/models/user';
import { Kind } from 'graphql';
import { MockGraphQLClient } from '../../helper/mock-graphql-client';
import { MockAuthenticationService } from '../../helper/mock-authentication-service';
import { MockPostService } from '../../helper/mock-post-service';
import { PostGenerator } from '../../helper/post-generator';
import { Post } from '../../client/models/post';
import { GraphQLServer } from '../../../src/graphql/graphql-server';
import { GRAPHQL_RESOLVERS } from '../../../src/graphql/graphql-resolvers';

const FAKE_USER_ID = "this user doesn't exist";

/**
 * Test cases
 */
describe('GraphQLServer (with MockPostService)', () => {
  let pagePosts: Post[][];
  let maxPostCount;
  let graphqlClient: MockGraphQLClient;

  beforeAll(() => {
    const { baseUrl, clientInfo, pageCount } = environment.dataServer;
    expect(baseUrl).toBeTruthy();
    expect(clientInfo).toBeTruthy();
    expect(pageCount).toBeTruthy();
    expect(pageCount).not.toBeNaN();

    pagePosts = PostGenerator.generateSortedPostPages();
    maxPostCount = PostGenerator.getPostCount(pagePosts);
    const authenticationService = new MockAuthenticationService(() => Promise.resolve(Utils.generateRandomId(20)));
    const postService = new MockPostService(baseUrl, authenticationService, undefined, pageCount, pagePosts);
    graphqlClient = new MockGraphQLClient(new GraphQLServer(authenticationService, () => postService));
  });

  // after the tests we'll stop the server
  afterAll(async () => {
    await graphqlClient.stopServer();
  });

  describe('Fetch posts', () => {
    beforeEach(() => {
      jest.setTimeout(60000);
    });

    test('fetch random page', async () => {
      for (let i = 0; i < 4; ++i) {
        // filter with user ID every second test
        const userId = i % 2 == 0 ? `user_${Utils.getRandomInt(20)}` : undefined;

        const size = (Utils.getRandomInt(10) + 1) * 20;
        const index = Utils.getRandomInt(20);

        const blog = await graphqlClient.fetchPosts({ pageIndex: index, pageSize: size, userId });
        expect(blog).toBeTruthy();

        if (userId) {
          expect(blog.posts.length).toBeGreaterThanOrEqual(0);
          expect(blog.totalPostCount).toBeGreaterThanOrEqual(0);
          // ideally, >= should be used, but there is a very little chance that blog consists of only one user
          expect(blog.totalPostCount).toBeLessThan(maxPostCount);
        } else {
          const expectedSize = Math.min(size, Math.max(maxPostCount - size * index, 0));
          expect(blog.posts.length).toBe(expectedSize);
          expect(blog.totalPostCount).toBe(maxPostCount);
        }

        const startIndex = size * index;
        const blogSize = blog.posts.length;

        for (let k = 0; k < size; ++k) {
          const post = PostGenerator.getPostByIndex(pagePosts, startIndex + k, userId);
          if (k < blogSize) {
            const blogPost = blog.posts[k];
            expect(blogPost.id).toStrictEqual(post.id);
            expect(blogPost.userId).toStrictEqual(post.userId);
            expect(blogPost.userName).toStrictEqual(post.userName);
            expect(blogPost.message).toStrictEqual(post.message);
            expect(blogPost.type).toStrictEqual(post.type);
            expect(blogPost.createdTime.valueOf()).toStrictEqual(post.createdTime);
          } else {
            expect(post).toBeNull();
          }
        }
      }
    });

    test('fetch posts from non-existing user', async () => {
      const pageSize = 100;
      const blog = await graphqlClient.fetchPosts({ pageIndex: 0, pageSize, userId: FAKE_USER_ID });
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
  const dateScalarDefinition = GRAPHQL_RESOLVERS.Date;
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
