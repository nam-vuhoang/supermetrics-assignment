import {
  Alert,
  Grid,
} from '@mui/material';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { UserStatsComponent } from '../../components/user-stats-component';
import { environment } from '../../environment/environment';
import { User } from '../../models/user';
import { PostService } from '../../services/post-service';
import { sortArray } from '../../utils/utils';

interface PageProps {
  users: User[];
}

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

export const getStaticProps: GetStaticProps = async (context) => {
  return new PostService(environment.backendUrl)
    .fetchFullStats()
    .then((users) => ({
      props: {
        users: sortArray(users, (u) => u.userName),
      },
    }));
};

export default function UserDashboard(props: PageProps): ReactNode {
  const router = useRouter();

  const userIdParam = router.query.userId;
  const userId = Array.isArray(userIdParam) ? userIdParam[0] : userIdParam;

  const { users } = props;
  const user = userId ? users.find((u) => u.userId === userId) : undefined;

  if (!user) {
    return <Alert severity="error">User not found</Alert>;
  }

  return (
    <div>
      <Grid container>
        <Grid item xs={2}>
          {users.map((u) => (
            <div key={u.userId}>
              <Link href={`/dashboard/${u.userId}`} shallow>
                {u.userName}
              </Link>
            </div>
          ))}
        </Grid>
        <Grid item xs={10}>
          <UserStatsComponent user={user} />
        </Grid>
      </Grid>
    </div>
  );
}
