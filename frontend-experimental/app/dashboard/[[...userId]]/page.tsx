import { PostService } from '../../../services/post-service';
import { UserStatsTableComponent } from './UsersStatsTableComponent';
import { environment } from '../../../environment/environment';
import MuiAlert from '../../../components/use-client/MuiAlert';
import { UserListMenu } from './UserListMenu';
import MuiGrid from '../../../components/use-client/MuiGrid';
import { UserStatsComponent } from './UserStatsComponent';

export async function generateStaticParams() {
  return new PostService(environment.backendUrl)
    .fetchUserIds()
    .then((userIds) => userIds.map((userId) => ({ userId: [userId] })))
    .then((params) => {
      params.push({ userId: [] });
      return params;
    });
}

export default async function Page({
  params,
}: {
  params: { userId: [string] };
}) {
  const actualUserId = params.userId[0] ? decodeURIComponent(params.userId[0]) : undefined;

  const users = await new PostService(environment.backendUrl).fetchFullStats();

  if (!actualUserId) {
    // display dashboard for all users
    return <UserStatsTableComponent users={users} />;
  }

  const user = users.find((u) => u.userId === actualUserId);
  if (!user) {
    return <MuiAlert severity="error">User not found: {actualUserId}</MuiAlert>;
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
