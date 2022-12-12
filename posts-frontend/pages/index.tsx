import { GetStaticProps } from 'next';
import { BlogView } from '../components/blog-view';
import { Post } from '../models/post';
import { PostService } from '../services/post-service';

export const getStaticProps: GetStaticProps = async () => {
  const posts = await PostService.getInstance().getLastPosts(12);

  return {
    props: {
      posts,
    },
  };
};

export default function Home(props: { posts: Post[] }) {
  return (
    <>
      <BlogView posts={props.posts} page={{ index: 1, size: 30 }} />;
    </>
  );
}
