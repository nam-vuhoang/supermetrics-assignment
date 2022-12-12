import { Alert, Box, Link, Pagination, PaginationItem } from '@mui/material';
import { GetServerSideProps } from 'next';
import React from 'react';
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

  const maxPostCount$: Promise<number> = Promise.resolve(1000);
    // PostService.getInstance().getPostCount(userFilter);

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
          renderItem={(item) => (
            <PaginationItem
              component={Link}
              href={`/${item.page === 1 ? '' : `?page=${item.page}`}`}
              {...item}
            />
          )}
        />
      </Box>
    </>
  );
}
