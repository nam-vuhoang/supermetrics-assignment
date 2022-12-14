import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Component, ReactNode } from 'react';
import { User } from '../models/user';
import { MaterialUtils } from '../utils/material/material-utils';
import { MomentUtils } from '../utils/moment-utils';
import { BlogComponent } from './blog-component';
import { PostComponent } from './post-component';
import { PostCountStatsComponent } from './post-count-stats-component';
import { PostLengthStatsComponent } from './post-length-stats-component';

export class UserStatsComponent extends Component<{
  user: User;
}> {
  render(): ReactNode {
    const { user } = this.props;

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
}
