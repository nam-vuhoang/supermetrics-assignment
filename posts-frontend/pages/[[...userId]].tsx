import {
  Alert,
  Box,
  Link,
  Pagination,
  PaginationItem,
} from '@mui/material';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import React, { ReactNode } from 'react';
import { BlogComponent } from '../components/blog-component';
import { Post } from '../models/post';
import { PostService } from '../services/post-service';
import useSWR from 'swr';
import { environment } from '../environment/environment';

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
  const pageNumber = Number(query.page || '1');
  if (isNaN(pageNumber)) {
    throw new Error('Invalid page number');
  }

  const pageCount = Number(query.pageCount || '0');
  if (isNaN(pageNumber)) {
    throw new Error('Invalid page count number');
  }

  const { userId } = query;
  const userFilter = userId
    ? decodeURIComponent(Array.isArray(userId) ? userId[0] : userId)
    : null;
  const postService = new PostService(backendUrl);
  const posts$: Promise<Post[]> = postService.fetchPosts(
    pageNumber - 1,
    PAGE_SIZE,
    userFilter
  );

  const pageCount$: Promise<number> = pageCount
    ? Promise.resolve(pageCount)
    : postService.fetchPageCount(PAGE_SIZE, userFilter);

  const data = await Promise.all([posts$, pageCount$]);
  return {
    posts: data[0],
    pageCount: data[1],
    userId: userFilter,
    pageNumber,
  };
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

  let href = userId ? encodeURIComponent(userId) : '';
  href += `?pageCount=${pageCount}`;

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
              href={href + (item.page === 1 ? '' : `&page=${item.page}`)}
              {...item}
            />
          )}
        />
      </Box>
    </>
  );
}
