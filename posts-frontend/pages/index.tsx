import { Pagination } from '@mui/material';
import { GetServerSideProps, GetStaticProps } from 'next';
import React, { useEffect } from 'react';
import { BlogView } from '../components/blog-view';
import { Post } from '../models/post';
import { PostService } from '../services/post-service';
import { logger } from '../utils/logger';

const PAGE_SIZE = 12;

async function getPagePosts(pageIndex: number, userId?: string): Promise<Post[]> {
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
  // const posts = await PostService.getInstance().getPosts(
  //   pageNumber - 1,
  //   PAGE_SIZE
  // );
  const posts = await getPagePosts(pageNumber - 1, userId);

  return {
    props: {
      posts,
    },
  };
};

export default function Home(props: { posts: Post[]; error?: string }) {
  const [page, setPage] = React.useState(1);

  return (
    <>
      <BlogView posts={props.posts} />;
      <Pagination
        count={10}
        page={page}
        onChange={(_, page) => setPage(page)}
      />
    </>
  );
}
