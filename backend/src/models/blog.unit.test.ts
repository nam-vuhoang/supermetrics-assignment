import { Blog } from './blog';
import { Post } from './post';
import { User } from './user';
import { UserStats } from './user-stats';
import { Utils } from '../utils/utils';

describe('Class Blog', () => {
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
