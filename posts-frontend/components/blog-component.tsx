import { Component, ReactNode } from 'react';
import { Post } from '../models/post';
import { PostComponent } from './post-component';
import { Box, Grid } from '@mui/material';

export class BlogComponent extends Component<{
  posts: Post[];
  columns?: number;
  expand?: boolean;
}> {
  static readonly DEFAULT_COLUMN_NUMBER = 3;

  render(): ReactNode {
    const { posts, columns, expand: expandAll } = this.props;
    const columnNumber = Math.min(
      columns || BlogComponent.DEFAULT_COLUMN_NUMBER,
      posts.length
    );
    return (
      <div>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container columnSpacing={4} rowSpacing={6}>
            {posts.map((p) => (
              <Grid item key={p.id} xs={12 / columnNumber}>
                <PostComponent post={p} expand={!!expandAll} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </div>
    );
  }
}
