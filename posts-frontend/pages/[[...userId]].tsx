import { Box, Link, Pagination, PaginationItem } from '@mui/material';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { Post } from '../models/post';
import { GraphQLClient } from '../services/graphql-client';
import useSWR from 'swr';
import { environment } from '../environment/environment';
import BlogComponent from '../components/blog-component';
import ErrorPanel from '../components/utils/error-panel';
import LoadingInfoPanel from '../components/utils/loading-info-panel';
import WarningPanel from '../components/utils/warning-panel';

const PAGE_SIZE = 15;

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

  const { userId: userQuery } = query;
  const userId = userQuery
    ? decodeURIComponent(Array.isArray(userQuery) ? userQuery[0] : userQuery)
    : null;
  return new GraphQLClient(backendUrl)
    .fetchPosts({ pageIndex: pageParam - 1, pageSize: PAGE_SIZE, userId })
    .then((data: { posts: Post[]; totalPostCount: number }) => ({
      posts: data.posts,
      pageCount: Math.ceil(data.totalPostCount / PAGE_SIZE),
      userId,
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
      refreshInterval:
        environment.fontend.blogPageRefreshIntervalInSeconds * 1000,
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

  if (posts.length === 0) {
    return (
      <WarningPanel
        message={`No post found for user ID '${userId}' and page number ${pageNumber}. Please check input data.`}
      />
    );
  }

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
