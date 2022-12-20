import { Grid } from '@mui/material';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import ErrorPanel from '../../components/utils/error-panel';
import LoadingInfoPanel from '../../components/utils/loading-info-panel';
import UserListMenu from '../../components/user-list-menu';
import UserStatsComponent from '../../components/user-stats-component';
import UserStatsTableComponent from '../../components/user-stats-table-component';
import { environment } from '../../environment/environment';
import { User } from '../../models/user';
import { GraphQLClient } from '../../services/graphql-client';
import { Utils } from '../../utils/utils';

interface PageProps {
  users: User[];
  error?: string;
}

/**
 * Generate all possible paths for the dynamic route of this page.
 * @returns
 */
export const getStaticPaths: GetStaticPaths = async () => {
  return new GraphQLClient(environment.backendUrl)
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

/**
 *Generates static props for each static path
 * (actually the result is independent from the static path context).
 * @param context
 * @returns
 */
export const getStaticProps: GetStaticProps = async (context) => {
  return new GraphQLClient(environment.backendUrl)
    .fetchFullStats()
    .then((users) => ({
      props: {
        users: Utils.sortArray(users, (u) => u.userName.toString()),
      },

      // example: https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration
      revalidate: environment.fontend.dashboardPageRefreshIntervalInSeconds
    }));
};

/**
 * Generate the common user dashboard with links to each user dashboard page.
 * This page uses SSG (Static-site generation approach:
 * https://nextjs.org/docs/basic-features/data-fetching/get-static-paths)
 * 
 */
export default function UserDashboard({
  users,
  error,
}: PageProps): JSX.Element {
  const router = useRouter();

  if (error) {
    return <ErrorPanel error={error} />;
  }

  if (!users) {
    return <LoadingInfoPanel />;
  }

  const userIdParam = router.query.userId;
  const userId = Array.isArray(userIdParam) ? userIdParam[0] : userIdParam;

  if (!userId) {
    // display dashboard for all users
    return <UserStatsTableComponent users={users} />;
  }

  const user = users.find((u) => u.userId === userId);
  if (!user) {
    return <ErrorPanel error={`User not found: ${userId}.`} />;
  }

  return (
    <Grid container columnSpacing={4}>
      {/* Menu */}
      <Grid item xs={2}>
        <UserListMenu
          href="/dashboard/"
          users={users}
          itemTooltip={(userName) =>
            `Click to see ${userName}'s dashboard page`
          }
          allUsersItemName="Pivot table"
          allUsersItemTooltip="Click to see the dashboard for all users"
        />
      </Grid>

      {/* User stats */}
      <Grid item xs={10}>
        <UserStatsComponent user={user} />
      </Grid>
    </Grid>
  );
}
