import { Component } from 'react';
import { PageFilter } from '../models/page-filter';
import { Post } from '../models/post';
import { PostsView } from './posts-view';

export class BlogView extends Component<{ posts: Post[]; page: PageFilter }> {
  render() {
    const { posts, page } = this.props;
    return (
      <div>
        <PostsView posts={posts} />
      </div>
    );
  }
}
