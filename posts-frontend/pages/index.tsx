import {
  Alert,
  Box,
  Link,
  Pagination,
  PaginationItem,
  PaginationRenderItemParams,
} from '@mui/material';
import { GetServerSideProps } from 'next';
import React from 'react';
import { BlogView } from '../components/blog-view';
import { Post } from '../models/post';
import { PostService } from '../services/post-service';

const PAGE_SIZE = 15;

interface PageProps {
  posts: Post[];
  userId: string | null;
  pageNumber: number;
  pageCount: number;
  error: any;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const pageNumber = Number(context.query.page || '1');
  if (isNaN(pageNumber)) {
    return {
      props: {
        error: 'Invalid page number',
      },
    };
  }

  const pageCount = Number(context.query.pageCount || '0');
  if (isNaN(pageNumber)) {
    return {
      props: {
        error: 'Invalid page count number',
      },
    };
  }

  const { userId } = context.query;
  const userFilter = userId
    ? decodeURIComponent(Array.isArray(userId) ? userId[0] : userId)
    : null;
  const posts$: Promise<Post[]> = PostService.getInstance().getPosts(
    pageNumber - 1,
    PAGE_SIZE,
    userFilter
  );

  const pageCount$: Promise<number> = pageCount
    ? Promise.resolve(pageCount)
    : PostService.getInstance().getPageCount(PAGE_SIZE, userFilter);

  return await Promise.all([posts$, pageCount$])
    .then((result) => {
      return {
        props: {
          posts: result[0],
          pageCount: result[1],
          pageNumber,
          userId: userFilter,
        },
      };
    })
    .catch((error) => {
      return {
        props: {
          error,
        },
      };
    });
};

export default function Home(props: PageProps) {
  const { posts, pageNumber, pageCount, userId, error } = props;

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  let href = `?pageCount=${pageCount}`;
  if (userId) {
    href += `&userId=${encodeURIComponent(userId)}`;
  }

  return (
    <>
      <BlogView posts={posts || []} />
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
