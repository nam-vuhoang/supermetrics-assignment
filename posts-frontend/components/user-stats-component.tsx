import { Grid } from '@mui/material';
import React from 'react';
import { User } from '../models/user';
import BlogComponent from './blog-component';
import PostCountStatsComponent from './post-count-stats-component';
import PostLengthStatsComponent from './post-length-stats-component';

/**
 * Render the grid with single user statistics.
 */
export default function UserStatsComponent({
  user,
}: {
  user: User;
}): JSX.Element {
  return (
    <Grid container columnSpacing={4} rowSpacing={6}>
      <Grid item xs={7}>
        <Grid container columnSpacing={4} rowSpacing={6}>
          <Grid item xs={6}>
            {/* Card with user's frequency statistics */}
            <PostCountStatsComponent user={user} />
          </Grid>
          <Grid item xs={6}>
            {/* Card with user's post length statistics */}
            <PostLengthStatsComponent user={user} />
          </Grid>
        </Grid>
      </Grid>

      {/* Blog with user's longest post */}
      <Grid item xs={5}>
        <BlogComponent
          posts={user.stats.longestPosts}
          columns={1}
          expandAll={true}
          caption="Longest post"
          hideDashboardLink={true}
        />
      </Grid>
    </Grid>
  );
}
