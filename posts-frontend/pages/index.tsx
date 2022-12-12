import { Alert, Box, Pagination } from '@mui/material';
import { Container } from '@mui/system';
import { GetServerSideProps, GetStaticProps } from 'next';
import React, { useEffect } from 'react';
import { BlogView } from '../components/blog-view';
import { Post } from '../models/post';
import { PostService } from '../services/post-service';
import { logger } from '../utils/logger';

const PAGE_SIZE = 15;

interface PageProps {
  posts?: Post[];
  pageCount?: number;
  error?: any;
}

async function getPagePosts(
  pageIndex: number,
  userId?: string
): Promise<Post[]> {
  logger.debug(`Fetching page ${pageIndex}`);
  return PostService.getInstance().getPosts(pageIndex, PAGE_SIZE, userId);
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

  const { userId } = context.query;
  const userFilter = Array.isArray(userId) ? userId[0] : userId;
  const posts$: Promise<Post[]> = PostService.getInstance().getPosts(
    pageNumber - 1,
    PAGE_SIZE,
    userFilter
  );

  const maxPostCount$: Promise<number> =
    PostService.getInstance().getPostCount(userFilter);

  return await Promise.all([posts$, maxPostCount$])
    .then((result) => {
      const posts = result[0];
      const maxPostCount = result[1];
      return {
        props: {
          posts,
          pageCount: Math.ceil(maxPostCount / PAGE_SIZE),
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
  const [page, setPage] = React.useState(1);
  const { posts, pageCount, error } = props;

  if (error) {
    return <Alert severity="error">{error}</Alert>;
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
          count={pageCount}
          page={page}
          onChange={(_, page) => setPage(page)}
        />
      </Box>
    </>
  );
}
