import { GetStaticProps } from 'next';
import { BlogView } from '../components/blog-view';
import { Post } from '../models/post';
import { PostService } from '../services/post-service';
import styles from '../styles/Layout.module.scss';

export const getStaticProps: GetStaticProps = async () => {
  // const posts: Post[] = getRecentPosts();
  const posts = await PostService.getInstance().getLastPosts(10);

  return {
    props: {
      posts,
    },
  };
};

export default function Home(props: { posts: Post[] }) {
  return (
    <>
      <BlogView posts={props.posts} page={{ index: 1, size: 25 }} />;
    </>
  );
}
