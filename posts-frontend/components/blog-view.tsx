import { Component } from 'react';
import { Post } from '../models/post';
import { PostsView } from './posts-view';

export class BlogView extends Component<{ posts: Post[] }> {
  render() {
    const { posts } = this.props;
    return <PostsView posts={posts} />;
  }
}
