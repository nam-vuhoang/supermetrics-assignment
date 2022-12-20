import { Box, Link, Pagination, PaginationItem } from '@mui/material';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { Post } from '../models/post';
import { PostService } from '../services/post-service';
import useSWR from 'swr';
import { environment } from '../environment/environment';
import BlogComponent from '../components/blog-component';
import ErrorPanel from '../components/utils/error-panel';
import LoadingInfoPanel from '../components/utils/loading-info-panel';

const PAGE_SIZE = 15;
const REFRESH_INTERVAL_IN_SECONDS = 60; // refresh every minute

interface PageProps {
  posts: Post[];
  userId: string | null;
  pageNumber: number;
  pageCount: number;
}

/**
 * Fetch blog posts on the client (browser) side.
 * @param backendUrl
 * @param query
 * @returns
 */
export async function fetchDataOnClientSide(
  backendUrl: string,
  query?: ParsedUrlQuery
): Promise<PageProps | null> {
  if (!query) {
    return Promise.resolve(null);
  }

  const pageParam = Number(query.page || '1');
  if (isNaN(pageParam)) {
    throw new Error('Invalid page number');
  }

  const { userId } = query;
  const userFilter = userId
    ? decodeURIComponent(Array.isArray(userId) ? userId[0] : userId)
    : null;
  return new PostService(backendUrl)
    .fetchPosts(pageParam - 1, PAGE_SIZE, userFilter)
    .then((data: { posts: Post[]; totalPostCount: number }) => ({
      posts: data.posts,
      pageCount: Math.ceil(data.totalPostCount / PAGE_SIZE),
      userId: userFilter,
      pageNumber: pageParam,
    }));
}

/**
 * Render the home page which uses client-side data fetching with SWR.
 * See more: https://nextjs.org/docs/basic-features/data-fetching/client-side.
 */
export default function Home(): JSX.Element {
  const router = useRouter();

  const { data, error } = useSWR(
    [environment.backendUrl, router.isReady ? router.query : undefined],
    ([url, query]) => fetchDataOnClientSide(url, query),
    {
      refreshInterval: REFRESH_INTERVAL_IN_SECONDS * 1000,
      revalidateOnReconnect: true, // default
    }
  );

  if (error) {
    return <ErrorPanel error={error} />;
  }

  if (!data) {
    return <LoadingInfoPanel />;
  }

  const { posts, pageCount, userId, pageNumber } = data;

  const href = userId ? encodeURIComponent(userId) : '/';

  return (
    <>
      <BlogComponent posts={posts} />

      <Box
        sx={{ pt: 6 }}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Pagination
          page={pageNumber}
          count={pageCount}
          showFirstButton
          showLastButton
          renderItem={(item) => (
            <PaginationItem
              component={Link}
              href={item.page === 1 ? href : `${href}?page=${item.page}`}
              {...item}
            />
          )}
        />
      </Box>
    </>
  );
}
