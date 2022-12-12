import { Pagination } from '@mui/material';
import { GetServerSideProps, GetStaticProps } from 'next';
import React, { useEffect } from 'react';
import { BlogView } from '../components/blog-view';
import { Post } from '../models/post';
import { PostService } from '../services/post-service';
import { logger } from '../utils/logger';

const PAGE_SIZE = 12;

async function getPagePosts(pageIndex: number): Promise<Post[]> {
  logger.debug(`Fetching page ${pageIndex}`);
  return PostService.getInstance().getPosts(pageIndex, PAGE_SIZE);
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const pageNumber = Number(context.query.page || '1');
  const posts = !isNaN(pageNumber) ? await getPagePosts(pageNumber - 1) : [];

  return {
    props: {
      posts,
    },
  };
};

export default function Home(props: { posts: Post[] }) {
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
