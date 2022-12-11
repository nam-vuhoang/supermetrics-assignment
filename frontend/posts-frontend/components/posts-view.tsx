import Link from "next/link";
import { Component } from "react";
import { Post } from "../models/post";
import { PostView } from "./post-view";

export class PostsView extends Component<{ posts: Post[] }> {
  render() {
    const { posts } = this.props;
    return (
      <div>
        {posts.map((p) => (
          <PostView key={p.id} post={p}></PostView>
        ))}
      </div>
    );
  }
}
