import {
  Box,
  Card,
  CardHeader,
  Grid,
  Tab,
  TableContainer,
  Typography,
} from '@mui/material';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ReactNode } from 'react';
import { BlogComponent } from '../../components/blog-component';
import { UserStatsComponent } from '../../components/user-stats-component';
import { environment } from '../../environment/environment';
import { Post } from '../../models/post';
import { UserStats } from '../../models/user-stats';
import { PostService } from '../../services/post-service';
import { MaterialUtils } from '../../utils/material/material-utils';

interface PageProps {
  userId?: string;
  stats: UserStats[];
  longestPosts: Post[];
}

export const getStaticProps: GetStaticProps = async (context) => {
  const userIds = context.params?.userId;
  const userId = Array.isArray(userIds) ? userIds[0] : userIds;
  return new PostService(environment.backendUrl)
    .fetchStatsAndLongestPosts(userId)
    .then((blog: { stats: UserStats[]; longestPosts: Post[] }) => {
      const { stats, longestPosts } = blog;
      return {
        props: { userId, stats, longestPosts },
      };
    });
};

export const getStaticPaths: GetStaticPaths = async () => {
  return new PostService(environment.backendUrl)
    .fetchUserIds()
    .then((userIds) =>
      userIds.map((userId) => {
        return { params: { userId } };
      })
    )
    .then((paths) => {
      return {
        paths,
        fallback: true,
      };
    });
};

export default function UserDashboard(props: PageProps): ReactNode {
  const { userId, stats, longestPosts } = props;
  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container columnSpacing={4} rowSpacing={6}>
          <Grid item xs={3}>
            <UserStatsComponent stats={stats[0]} />
          </Grid>
          <Grid item xs={9}>
            <BlogComponent posts={longestPosts} expand={true} />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
