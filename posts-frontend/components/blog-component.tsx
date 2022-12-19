import { Post } from '../models/post';
import { PostComponent } from './post-component';
import { Box, Grid } from '@mui/material';

const DEFAULT_COLUMN_NUMBER = 3;

/**
 * Render a list of PostComponent in the grid format.
 * @returns 
 */
export default function BlogComponent({
  posts,
  columns,
  expandAll,
  caption,
  hideDashboardLink,
}: {
  posts: Post[];
  columns?: number;
  expandAll?: boolean;
  caption?: string;
  hideDashboardLink?: boolean;
}): JSX.Element {
  const columnNumber = Math.min(columns || DEFAULT_COLUMN_NUMBER, posts.length);

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container columnSpacing={4} rowSpacing={6}>
          {posts.map((p) => (
            <Grid item key={p.id} xs={12 / columnNumber}>
              <PostComponent
                post={p}
                expand={!!expandAll}
                caption={caption}
                hideDashboardLink={hideDashboardLink}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
}
