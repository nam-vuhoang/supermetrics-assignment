import { Blog } from './blog';
import { Post } from './post';
import { User } from './user';
import { UserStats } from './user-stats';
import { Utils } from '../utils/utils';
import exp from 'constants';

describe('Class Blog: constructor', () => {
  const size = 10;
  const totalSize = 1000;
  const posts: Post[] = Utils.createNumberRange(size)
    .map((n) => n + 1)
    .map((n) => {
      // user_N creates N posts
      const userPosts: Post[] = Utils.createNumberRange(n)
        .map((i) => i + 1)
        .map((i) => ({
          id: `id_${n}`,
          userId: `user_${n}`,
          userName: `USER_${n}`,
          message: 'a'.repeat(n * i),
          type: `{2022, ${Math.floor(i / 2)}, ${i}}`,
          createdTime: new Date(Date.UTC(2022, Math.floor(i / 2), i, 5, 10, 20)), // hours = 5 to avoid time zone mismatch.
        }));

      return userPosts;
    })
    .flat();

  const blog = new Blog(posts, totalSize);

  test('totalSize', () => {
    expect(blog.totalPostCount).toBe(totalSize);
  });

  test('posts', () => {
    expect(blog.posts).toStrictEqual(posts);
  });

  test('expectedSize', () => {
    const expectedSize = Utils.getArraySum(Utils.createNumberRange(size).map((i) => i + 1)); // sum from 1 to 10
    expect(expectedSize).toBe(55);
    expect(blog.size).toBe(expectedSize);
  });

  describe('authors', () => {
    const authors = blog.authors();

    test('authors.length', () => {
      expect(authors.length).toBe(size);
    });

    describe.each(authors)('with each author', (author: User) => {
      const n = Number(author.userId.substring(author.userId.indexOf('_') + 1));
      expect(Number.isNaN(n)).toBe(false);

      test('userId', () => {
        expect(author.userId).toBe(`user_${n}`);
      });

      test('userName', () => {
        expect(author.userName).toBe(`USER_${n}`);
      });

      describe('stats', () => {
        const stats: UserStats = author.stats();

        test('stats.totalCount', () => {
          expect(stats.totalCount).toBe(n);
        });

        test('stats.minLength', () => {
          expect(stats.minLength).toBe(n);
        });

        test('stats.maxLength', () => {
          expect(stats.maxLength).toBe(n * n);
        });

        test('stats.averageLength', () => {
          const expectedTotalLength = Utils.getArraySum(Utils.createNumberRange(n).map((i) => i + 1)) * n;
          const expectedAverageLength = Math.ceil(expectedTotalLength / stats.totalCount);
          // console.log(n, '=>', expectedTotalLength, '=>', expectedAverageLength);
          expect(stats.averageLength).toBeCloseTo(expectedAverageLength);
        });

        describe('stats.frequencies', () => {
          const { frequencies } = stats;

          test('frequencies.length', () => {
            expect(frequencies.length).toBe(Math.ceil((n + 1) / 2));
          });

          test('stats.totalCount', () => {
            expect(Utils.getArraySum(frequencies.map((f) => f.count))).toBe(stats.totalCount);
          });

          describe.each(frequencies)('with each frequency', (frequency) => {
            test('frequency.month', () => {
              const { month } = frequency;
              expect(month.getFullYear()).toBe(2022);
              expect(month.getDate()).toBe(1);
            });

            test('frequency.count', () => {
              const m = frequency.month.getMonth();
              const isLastMonth = m === frequencies.length - 1;

              // first month => 1
              // every next month => 2 (except the last month if n is even => 1)
              const expectedCount = m === 0 || (isLastMonth && n % 2 === 0) ? 1 : 2;
              expect(frequency.count).toBe(expectedCount);
            });
          });
        });

        describe('stats.longestPosts', () => {
          const longestPosts = stats.longestPosts();

          test('longestPosts.length', () => {
            expect(longestPosts.length).toBe(1);
          });

          test.each(longestPosts)('with each longestPost', (longestPost) => {
            const expectedLength = n * n;
            expect(longestPost.message.length).toBe(expectedLength);
            expect(longestPost.message).toBe('a'.repeat(expectedLength));
          });
        });
      });
    });
  });
});

describe('Class Blog: static method createBlog', () => {
  const startDate = Utils.getMonthUTC(new Date()).valueOf();

  const originalSize = 100;
  const originalPosts = Utils.createNumberRange(originalSize).map((n) => ({
    id: n.toString(),
    userId: `user_${n}`,
    userName: `USER_${n}`,
    message: '',
    type: '',
    createdTime: new Date(startDate + n * 1000000), // create post every 1000 secs
  }));

  const orderedPostsAsc = Utils.sortArray([...originalPosts], p => p.createdTime.valueOf());
  const orderedPostsDesc = Utils.sortArray([...originalPosts], p => p.createdTime.valueOf(), true);

  // console.log(originalPosts);

  test('When no page filter and no order', () => {
    const blog = Blog.createBlog([...originalPosts]);
    expect(blog.size).toBe(originalPosts.length);
    expect(blog.totalPostCount).toBe(originalPosts.length);
    expect(blog.posts).toStrictEqual(originalPosts);
  });

  test('When no page filter and ASC order', () => {
    const blog = Blog.createBlog([...originalPosts], undefined, true);
    expect(blog.size).toBe(originalPosts.length);
    expect(blog.totalPostCount).toBe(originalPosts.length);
    expect(blog.posts).toStrictEqual(orderedPostsAsc);
  });

  test('When no page filter and DESC order', () => {
    const blog = Blog.createBlog([...originalPosts], undefined, false);
    expect(blog.size).toBe(originalPosts.length);
    expect(blog.totalPostCount).toBe(originalPosts.length);
    expect(blog.posts).toStrictEqual(orderedPostsDesc);
  });

  test('When page filter defined', () => {
    for (let i = 0; i < 100; ++i) {
      const pageIndex = Utils.getRandomInt(20);
      const pageSize = Utils.getRandomInt(150);
      const sorterAsc: boolean | undefined = i % 3 === 0 ? true : i % 3 === 1 ? false : undefined;
      const blog = Blog.createBlog([...originalPosts], { index: pageIndex, size: pageSize }, sorterAsc);

      expect(blog.totalPostCount).toBe(originalSize);

      const expectedSize = Math.min(pageSize, Math.max(originalSize - pageSize * pageIndex, 0));
      expect(blog.size).toBe(expectedSize);

      const { posts } = blog;
      const newestFirst = !sorterAsc;

      posts.forEach((post, index) => {
        const postId = Number(post.id);
        expect(postId).not.toBeNaN();
        if (newestFirst) {
          expect(postId).toBe(originalSize - pageSize * pageIndex - index - 1);
        } else {
          expect(postId).toBe(pageSize * pageIndex + index);
        }
      });
    }
  });
});
