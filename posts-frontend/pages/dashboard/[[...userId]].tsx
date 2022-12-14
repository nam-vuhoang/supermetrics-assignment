import {
  Alert,
  Grid,
  Table,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { UserStatsComponent } from '../../components/user-stats-component';
import { UserStatsTableComponent } from '../../components/user-stats-table-component';
import { environment } from '../../environment/environment';
import { User } from '../../models/user';
import { PostService } from '../../services/post-service';
import { logger } from '../../utils/logger';
import { sortArray } from '../../utils/utils';

interface PageProps {
  users: User[];
  error?: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  return new PostService(environment.backendUrl)
    .fetchUserIds()
    .then((userIds) =>
      userIds.map((userId) => {
        return { params: { userId: [userId] } };
      })
    )
    .then((paths) => {
      return {
        paths,
        fallback: true, // do not return 404 when requesting unknown userId
      };
    });
};

export const getStaticProps: GetStaticProps = async (context) => {
  return new PostService(environment.backendUrl)
    .fetchFullStats()
    .then((users) => ({
      props: {
        users: sortArray(users, (u) => u.userName.toString()),
      },
    }))
    .catch((error) => {
      logger.error(error);
      return {
        props: {
          error: `Unexpected error: ${JSON.stringify(error, undefined, 2)}`,
        },
      };
    });
};

export default function UserDashboard(props: PageProps): ReactNode {
  const router = useRouter();
  const { users, error } = props;

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!users) {
    return <Alert severity="info">Loading data...</Alert>;
  }

  const userIdParam = router.query.userId;
  const userId = Array.isArray(userIdParam) ? userIdParam[0] : userIdParam;

  if (!userId) {
    // display dashboard for all users
    return <UserStatsTableComponent users={users} />;
  }

  const user = users.find((u) => u.userId === userId);
  if (!user) {
    return <Alert severity="error">User not found: {userId}</Alert>;
  }

  return (
    <div>
      {/* Menu */}
      <Grid container>
        <Grid item xs={2}>
          <Table>
            <TableRow>
              <TableCell>
                <Link href={`/dashboard/`} shallow>
                  <Typography color="primary">Pivot table</Typography>
                </Link>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                {users.map((u) => (
                  <div key={u.userId}>
                    <Link
                      href={`/dashboard/${encodeURIComponent(u.userId)}`}
                      shallow
                    >
                      <Typography color="primary">{u.userName}</Typography>
                    </Link>
                  </div>
                ))}
              </TableCell>
            </TableRow>
          </Table>
        </Grid>

        {/* User stats */}
        <Grid item xs={10}>
          <UserStatsComponent user={user} />
        </Grid>
      </Grid>
    </div>
  );
}
