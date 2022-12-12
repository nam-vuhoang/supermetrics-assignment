import { Box, Pagination } from '@mui/material';
import { Container } from '@mui/system';
import { GetServerSideProps, GetStaticProps } from 'next';
import React, { useEffect } from 'react';
import { BlogView } from '../components/blog-view';
import { Post } from '../models/post';
import { PostService } from '../services/post-service';
import { logger } from '../utils/logger';

const PAGE_SIZE = 15;

interface PageProps {
  posts: Post[];
  pageCount?: number;
  error?: string;
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
        posts: [],
        error: 'Invalid page number',
      },
    };
  }

  const { userId } = context.query;
  const posts = await getPagePosts(
    pageNumber - 1,
    Array.isArray(userId) ? userId[0] : userId
  );

  const maxPostCount = await PostService.getInstance().getPostCount(
    Array.isArray(userId) ? userId[0] : userId
  );

  return {
    props: {
      posts,
      pageCount: Math.ceil(maxPostCount / PAGE_SIZE),
    },
  };
};

export default function Home(props: PageProps) {
  const [page, setPage] = React.useState(1);
  const { posts, pageCount, error } = props;

  // TODO: Show error if any
  return (
    <>
      <BlogView posts={posts} />
      <Box sx={{ pt: 6 }} display="flex" justifyContent="center" alignItems="center">
        <Pagination
          count={pageCount}
          page={page}
          onChange={(_, page) => setPage(page)}
        />
      </Box>
    </>
  );
}
