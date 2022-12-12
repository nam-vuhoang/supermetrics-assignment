import { Component } from 'react';
import { Post } from '../models/post';
import { PostView } from './post-view';
import { Box, Grid } from '@mui/material';

export class PostsView extends Component<{ posts: Post[] }> {
  render() {
    const { posts } = this.props;
    return (
      <div>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container columnSpacing={4} rowSpacing={6}>
            {posts.map((p) => (
              <Grid item key={p.id} xs={4}>
                <PostView post={p} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </div>
    );
  }
}
