import { Favorite } from "@mui/icons-material";
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
  return (
    <>
      <header>
        <div className="main-header">
          <div className="horizontal-line"></div>
          <div id="header-panel">
            <a href="/">
              <img id="header-logo" src="assets/images/synergy-header-logo.svg" />
            </a>
            <div id="header-text">
              <h1><Favorite color="primary" /> HEARTBOOK <Favorite color="primary" /></h1>
            </div>
          </div>
        </div>
      </header>
      <section>
        <div className="content">
          <PostsView posts={props.posts} />;
        </div>
      </section>
      ;
    </>
  );
}

export default Blog;
