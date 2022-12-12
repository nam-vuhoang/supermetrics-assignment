import { Pagination } from '@mui/material';
import { GetStaticProps } from 'next';
import React from 'react';
import { BlogView } from '../components/blog-view';
import { Post } from '../models/post';
import { PostService } from '../services/post-service';

const PAGE_SIZE = 12;

async function getPagePosts(pageIndex: number): Promise<Post[]> {
  return PostService.getInstance().getPosts(pageIndex, PAGE_SIZE);
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getPagePosts(0);

  return {
    props: {
      posts,
    },
  };
};

export default function Home(props: { posts: Post[] }) {
  const [page, setPage] = React.useState(1);
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <>
      <BlogView posts={props.posts} />;
      <Pagination count={10} page={page} onChange={handlePageChange} />
    </>
  );
}
