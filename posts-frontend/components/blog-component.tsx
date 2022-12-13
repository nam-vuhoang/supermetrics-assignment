import { Component, ReactNode } from 'react';
import { Post } from '../models/post';
import { PostComponent } from './post-component';
import { Box, Grid } from '@mui/material';

export class BlogComponent extends Component<{
  posts: Post[];
  columns?: number;
  expand?: boolean;
}> {
  render(): ReactNode {
    const { posts, columns, expand } = this.props;
    const columnNumber = Math.min(columns || 3, posts.length);
    return (
      <div>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container columnSpacing={4} rowSpacing={6}>
            {posts.map((p) => (
              <Grid item key={p.id} xs={12 / columnNumber}>
                <PostComponent post={p} expand={!!expand} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </div>
    );
  }
}
