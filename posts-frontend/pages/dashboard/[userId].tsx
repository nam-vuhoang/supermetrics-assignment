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
import { User } from '../../models/user';
import { UserStats } from '../../models/user-stats';
import { PostService } from '../../services/post-service';
import { MaterialUtils } from '../../utils/material/material-utils';

interface PageProps {
  user: User;
  allUserIds: string[];
}

export const getStaticProps: GetStaticProps = async (context) => {
  const userIdParam = context.params?.userId;
  const userId = Array.isArray(userIdParam) ? userIdParam[0] : userIdParam;

  const postService = new PostService(environment.backendUrl);
  const user$ = postService.fetchFullStats(userId);
  const allUsersId$ = postService.fetchUserIds();

  return Promise.all([user$, allUsersId$]).then((data: [User[], string[]]) => {
    const [users, allUserIds] = data;
    return {
      props: {
        user: users[0],
        allUserIds,
      },
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
  const { user, allUserIds } = props;
  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <UserStatsComponent user={user} />
      </Box>
      <Box
        sx={{ pt: 6 }}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Pagination
          page={allUserIds.findIndex((s) => s === user.userId) + 1}
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
