import { Alert, Box, Link, Pagination, PaginationItem } from '@mui/material';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import React, { ReactNode } from 'react';
import { Post } from '../models/post';
import { PostService } from '../services/post-service';
import useSWR from 'swr';
import { environment } from '../environment/environment';
import BlogComponent from '../components/blog-component';

const PAGE_SIZE = 15;

interface PageProps {
  posts: Post[];
  userId: string | null;
  pageNumber: number;
  pageCount: number;
}

export async function fetchDataOnClientSide(
  backendUrl: string,
  query?: ParsedUrlQuery
): Promise<PageProps | null> {
  if (!query) {
    return Promise.resolve(null);
  }

  console.info(`fetchDataOnClientSide()`);
  console.warn(backendUrl);
  console.warn(query.page);
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

export default function Home(): ReactNode {
  const router = useRouter();

  const { data, error } = useSWR(
    [environment.backendUrl, router.isReady ? router.query : undefined],
    ([url, query]) => fetchDataOnClientSide(url, query)
  );

  if (error) {
    return (
      <Alert severity="error">
        Error: {JSON.stringify(error, undefined, 2)}
      </Alert>
    );
  }

  if (!data) {
    return <Alert severity="info">Loading...</Alert>;
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
