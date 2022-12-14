import {
  Box,
  Card,
  CardHeader,
  Grid,
  Link,
  Pagination,
  PaginationItem,
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
  userId: string;
  allUserIds: string[];
  stats: UserStats[];
  longestPosts: Post[];
}

export const getStaticProps: GetStaticProps = async (context) => {
  const userIdParam = context.params?.userId;
  const userId = Array.isArray(userIdParam) ? userIdParam[0] : userIdParam;

  const postService = new PostService(environment.backendUrl);
  const blog$ = postService.fetchStatsAndLongestPosts(userId);
  const allUsersId$ = postService.fetchUserIds();

  return Promise.all([blog$, allUsersId$]).then(
    (
      data: [
        {
          stats: UserStats[];
          longestPosts: Post[];
        },
        string[]
      ]
    ) => {
      const { stats, longestPosts } = data[0];
      return {
        props: {
          userId: userId!,
          stats,
          longestPosts,
          allUserIds: data[1],
        },
      };
    }
  );
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
  const { userId, stats, longestPosts, allUserIds } = props;
  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <UserStatsComponent stats={stats[0]} longestPosts={longestPosts} />
      </Box>
      <Box
        sx={{ pt: 6 }}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Pagination
          page={allUserIds.findIndex((s) => s === userId) + 1}
          count={allUserIds.length}
          showFirstButton
          showLastButton
          renderItem={(item) => (
            <PaginationItem
              component={Link}
              href={`/dashboard/${encodeURIComponent(
                allUserIds[item.page! - 1]
              )}`}
              {...item}
            />
          )}
        />
      </Box>
    </div>
  );
}
