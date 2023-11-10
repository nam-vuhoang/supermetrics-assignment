import { GraphQLError } from 'graphql';
import { StatusCodes } from 'http-status-codes';
import { Post } from '../../test/client/models/post';
import { MockAuthenticationService } from '../../test/helper/mock-authentication-service';
import { MockPostService } from '../../test/helper/mock-post-service';
import { PostGenerator } from '../../test/helper/post-generator';
import { environment } from '../environment/environment';
import { Utils } from '../utils/utils';
import { PostService } from './post-service';

const FAKE_USER_ID = "this user doesn't exist";

/**
 * Test class PostService with MockAuthenticationService and MockPostService
 * (which overrides one method of PostService for avoiding real HTTP requests)/
 */
describe('Class PostService (with MockAuthenticationService and MockPostService)', () => {
  const { baseUrl, clientInfo, pageCount } = environment.dataServer;
  let authenticationService: MockAuthenticationService;
  let postService: MockPostService;
  let pagePosts: Post[][];
  let maxPostCount;

  beforeAll(() => {
    expect(baseUrl).toBeTruthy();
    expect(clientInfo).toBeTruthy();
    expect(pageCount).toBeTruthy();
    expect(pageCount).not.toBeNaN();

    pagePosts = PostGenerator.generateSortedPostPages();
    maxPostCount = PostGenerator.getPostCount(pagePosts);
    authenticationService = new MockAuthenticationService(() => Promise.resolve(Utils.generateRandomId(20)));
    postService = new MockPostService(baseUrl, authenticationService, undefined, pageCount, pagePosts);
  });

  test('Fetch random blog with page and user filter ', async () => {
    for (let i = 0; i < 40; ++i) {
      // filter with user ID every second test
      const userId = i % 2 == 0 ? `user_${Utils.getRandomInt(30)}` : undefined;

      const size = (Utils.getRandomInt(10) + 1) * 100;
      const index = Utils.getRandomInt(20);
      const blog = await postService.fetchBlog({ userId, page: { index, size } });

      expect(blog.posts.length).toBe(blog.size);

      if (userId) {
        expect(blog.size).toBeGreaterThanOrEqual(0);
        expect(blog.totalPostCount).toBeGreaterThanOrEqual(0);
        // ideally, >= should be used, but there is a very little chance that blog consists of only one user
        expect(blog.totalPostCount).toBeLessThan(maxPostCount);
      } else {
        const expectedSize = Math.min(size, Math.max(maxPostCount - size * index, 0));
        expect(blog.size).toBe(expectedSize);
        expect(blog.totalPostCount).toBe(maxPostCount);
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

      // compare authors
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

      // compare posts
      if (hasPosts) {
        const startIndex = size * index;

        for (let k = 0; k < size; ++k) {
          const post = PostGenerator.getPostByIndex(pagePosts, startIndex + k, userId);
          if (k < blog.size) {
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

describe('Class PostSerivce (with expiration)', () => {
  const { baseUrl, clientInfo, pageCount } = environment.dataServer;

  beforeAll(() => {
    expect(baseUrl).toBeTruthy();
    expect(clientInfo).toBeTruthy();
    expect(pageCount).toBeTruthy();
    expect(pageCount).not.toBeNaN();
  });

  test('When token is expired forever', async () => {
    const authenticationService = new MockAuthenticationService(
      () => Promise.resolve(Utils.generateRandomId(20)),
      () => true, // expire now
      () => false // never reset expiration
    );
    const postService = new MockPostService(
      baseUrl,
      authenticationService,
      undefined,
      pageCount,
      PostGenerator.generatePostPages()
    );

    expect(postService.mockAuthenticationService).toBeDefined();
    expect(postService.mockAuthenticationService.isExpired).toBe(true);

    try {
      await postService.fetchBlog({ userId: FAKE_USER_ID });
    } catch (e) {
      expect(postService.mockAuthenticationService.isExpired).toBe(true);
      expect(e).toBeInstanceOf(GraphQLError);
      const { response } = (<GraphQLError>e).extensions;
      expect((<any>response).status).toBe(StatusCodes.UNAUTHORIZED); // 401
      expect(authenticationService.retryCountAfterExpired).toBeGreaterThanOrEqual(
        PostService.MAX_RETRY_COUNT_IF_UNAUTHORIZED
      );
      return;
    }

    fail('it should not reach here');
  });

  test('When token is expired and reset after 2 retrials', async () => {
    const authenticationService = new MockAuthenticationService(
      () => Promise.resolve(Utils.generateRandomId(20)),
      () => true, // expire now
      (retryCountAfterExpired) => retryCountAfterExpired % 2 === 0 // reset next time
    );

    const postService = new MockPostService(baseUrl, authenticationService, undefined, pageCount);

    await postService.fetchBlog({ userId: FAKE_USER_ID });
    expect(authenticationService.retryCountAfterExpired).toBeGreaterThan(2);
  });
});

describe('Class PostSerivce (with wrong page)', () => {
  const { baseUrl, clientInfo, pageCount } = environment.dataServer;

  beforeAll(() => {
    expect(baseUrl).toBeTruthy();
    expect(clientInfo).toBeTruthy();
    expect(pageCount).toBeTruthy();
    expect(pageCount).not.toBeNaN();
  });

  test('When wrong page is returned', async () => {
    const authenticationService = new MockAuthenticationService(() => Promise.resolve(Utils.generateRandomId(20)));
    const postService = new MockPostService(
      baseUrl,
      authenticationService,
      undefined,
      pageCount,
      PostGenerator.generatePostPages(),
      true // return wrong page index
    );

    try {
      await postService.fetchBlog();
    } catch (e) {
      expect(e).toBeInstanceOf(GraphQLError);
      expect((<GraphQLError>e).message).toMatch(/Invalid data: expected page \d+, but got page \d+./);
      expect((<GraphQLError>e).extensions).toStrictEqual({
        code: 'DATA_SERVER_ERROR',
        argumentName: 'pageIndex',
      });
      return;
    }

    fail('it should not reach here');
  });

  test('When wrong page index was requested', async () => {
    const authenticationService = new MockAuthenticationService(() => Promise.resolve(Utils.generateRandomId(20)));
    const postService = new MockPostService(
      baseUrl,
      authenticationService,
      undefined,
      pageCount,
      PostGenerator.generatePostPages()
    );

    try {
      await postService.fetchBlog({ page: { index: -1, size: 10 } });
    } catch (e) {
      expect(e).toBeInstanceOf(EvalError);
      expect((<EvalError>e).message).toMatch(/Invalid page index:/);
      return;
    }

    fail('it should not reach here');
  });

  test('When wrong page size was requested', async () => {
    const authenticationService = new MockAuthenticationService(() => Promise.resolve(Utils.generateRandomId(20)));
    const postService = new MockPostService(
      baseUrl,
      authenticationService,
      undefined,
      pageCount,
      PostGenerator.generatePostPages()
    );

    try {
      await postService.fetchBlog({ page: { index: 1, size: 0 } });
    } catch (e) {
      expect(e).toBeInstanceOf(EvalError);
      expect((<EvalError>e).message).toMatch(/Invalid page size:./);
      return;
    }

    fail('it should not reach here');
  });
});
