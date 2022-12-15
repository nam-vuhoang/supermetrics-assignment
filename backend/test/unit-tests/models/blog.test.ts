import { Blog } from '../../../src/models/blog';
import { Post } from '../../../src/models/post';
import { User } from '../../../src/models/user';
import { UserStats } from '../../../src/models/user-stats';
import { Utils } from '../../../src/utils/utils';

test('test blog', () => {
  const size = 10;
  // const type = 'status';

  // generate test posts
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

  const totalSize = 1000;
  const blog = new Blog(posts, totalSize);
  expect(blog.totalPostCount).toBe(totalSize);

  expect(blog.posts).toStrictEqual(posts);
  expect(blog.authors.length).toBe(size);

  const expectedSize = Utils.sumArrayValues(Utils.createNumberRange(size), (i) => i + 1); // sum from 1 to 10
  expect(expectedSize).toBe(55);

  expect(blog.size).toBe(expectedSize);

  const authors: User[] = blog.authors;
  expect(authors.length).toBe(size);

  for (let author of authors) {
    const n = Number(author.userId.substring(author.userId.indexOf('_') + 1));
    expect(Number.isNaN(n)).toBe(false);
    expect(author.userId).toBe(`user_${n}`);
    expect(author.userName).toBe(`USER_${n}`);

    const stats: UserStats = author.stats();
    expect(stats.totalCount).toBe(n);
    expect(stats.minLength).toBe(n);
    expect(stats.maxLength).toBe(n * n);

    const expectedTotalLength = Utils.sumArrayValues(Utils.createNumberRange(n), (i) => i + 1) * n;

    const expectedAverageLength = Math.ceil(expectedTotalLength / stats.totalCount);
    // console.log(n, '=>', expectedTotalLength, '=>', expectedAverageLength);
    expect(stats.averageLength).toBeCloseTo(expectedAverageLength);

    const { frequencies } = stats;
    expect(frequencies.length).toBe(Math.ceil((n + 1) / 2));
    // console.log(frequencies);

    expect(Utils.sumArrayValues(frequencies, (f) => f.count)).toBe(stats.totalCount);

    for (let f of frequencies) {
      // console.log('month', f.month);
      expect(f.month.getFullYear()).toBe(2022);
      expect(f.month.getDate()).toBe(1);

      const m = f.month.getMonth();
      const isLastMonth = m === frequencies.length - 1;

      const expectedCount = m === 0 || (isLastMonth && n % 2 === 0) ? 1 : 2;
      // console.log('n=', n, ', month=', m, ', expected count=', expectedCount);
      expect(f.count).toBe(expectedCount);
    }
  }
});
