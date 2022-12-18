import { UserStatsTableComponent } from './UsersStatsTableComponent';
import { environment } from '../../../environment/environment';
import MuiAlert from '../../../components/use-client/MuiAlert';
import { UserListMenu } from './UserListMenu';
import MuiGrid from '../../../components/use-client/MuiGrid';
import { UserStatsComponent } from './UserStatsComponent';
import { cache } from 'react';
import { User } from '../../../models/user';
import { PostServiceWithFetchApi } from '../../../services/post-service-with-fetch-api';

// https://beta.nextjs.org/docs/api-reference/segment-config#configrevalidate
export const dynamic = 'force-static';
export const revalidate = 3600; // revalidate every hour

interface ParamsType {
  userId: string[];
}

const fetchUserIds: () => Promise<ParamsType[]> = cache(
  async () =>
    await new PostServiceWithFetchApi(environment.backendUrl)
      .fetchUserIds()
      .then((userIds) => userIds.map((userId) => ({ userId: [userId] })))
      .then((params) => {
        params.push({ userId: [] });
        return params;
      })
);

export async function generateStaticParams(): Promise<ParamsType[]> {
  return await fetchUserIds();
}

const fetchUserStats: () => Promise<User[]> = cache(
  async () => await new PostServiceWithFetchApi(environment.backendUrl).fetchFullStats()
);

export default async function Page({ params }: { params: ParamsType }) {
  const users = await fetchUserStats();

  const userId =
    params.userId && params.userId[0]
      ? decodeURIComponent(params.userId[0])
      : undefined;

  if (!userId) {
    // display dashboard for all users
    return <UserStatsTableComponent users={users} />;
  }

  const user = users.find((u) => u.userId === userId);
  if (!user) {
    return <MuiAlert severity="error">User not found: {userId}</MuiAlert>;
  }

  return (
    <MuiGrid container columnSpacing={4}>
      <MuiGrid item xs={2}>
        <UserListMenu users={users} />
      </MuiGrid>

      {/* User stats */}
      <MuiGrid item xs={10}>
        <UserStatsComponent user={user} />
      </MuiGrid>
    </MuiGrid>
  );
}
