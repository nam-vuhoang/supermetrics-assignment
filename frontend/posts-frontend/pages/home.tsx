import { GetStaticProps, InferGetStaticPropsType } from "next";
import { PostsView } from "../components/posts-view";
import { getRecentPosts } from "../lib/posts";
import { Post } from "../models/post";

export const getStaticProps: GetStaticProps = async (context) => {
  const posts: Post[] = getRecentPosts();

  return {
    props: {
      posts,
    },
  };
};

function Blog(props: { posts: Post[] }) {
  return <PostsView posts={props.posts} />;
}

export default Blog;
