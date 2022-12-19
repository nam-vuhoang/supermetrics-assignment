import { Grid } from '@mui/material';
import React from 'react';
import { Component, ReactNode } from 'react';
import { User } from '../models/user';
import BlogComponent from './blog-component';
import { PostCountStatsComponent } from './post-count-stats-component';
import PostLengthStatsComponent from './post-length-stats-component';

export default function UserStatsComponent({
  user,
}: {
  user: User;
}): ReactNode {
  return (
    <Grid container columnSpacing={4} rowSpacing={6}>
      <Grid item xs={7}>
        <Grid container columnSpacing={4} rowSpacing={6}>
          <Grid item xs={6}>
            <PostCountStatsComponent user={user} />
          </Grid>
          <Grid item xs={6}>
            <PostLengthStatsComponent user={user} />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={5}>
        <BlogComponent
          posts={user.stats.longestPosts}
          expandAll={true}
          caption="Longest post"
          hideDashboardLink={true}
        />
      </Grid>
    </Grid>
  );
}
