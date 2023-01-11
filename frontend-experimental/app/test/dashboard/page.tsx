// 'use client';

import { useState } from 'react';
import MuiAlert from '../../../components/use-client/MuiAlert';
import MuiGrid from '../../../components/use-client/MuiGrid';
import { environment } from '../../../environment/environment';
import { PostServiceWithFetchApi } from '../../../services/post-service-with-fetch-api';
import { Utils } from '../../../utils/utils';
import { UserListMenu } from '../../dashboard/[[...userId]]/UserListMenu';
import { UserStatsTableComponent } from '../../dashboard/[[...userId]]/UsersStatsTableComponent';
import { UserStatsComponent } from '../../dashboard/[[...userId]]/UserStatsComponent';
import { UserStatsComponentWithMenu } from '../../dashboard/[[...userId]]/UserStatsComponentWithMenu';

export default async function Page({
  params,
  searchParams,
}: {
  params?: {};
  searchParams?: { userId?: string };
}) {
  const users = await new PostServiceWithFetchApi(environment.backendUrl)
    .fetchFullStats()
    .then((users) => Utils.sortArray(users, (u) => u.userName));

  const userId = searchParams?.userId
    ? decodeURIComponent(searchParams?.userId)
    : undefined;

  if (!userId) {
    // display dashboard for all users
    return <UserStatsTableComponent users={users} />;
  }

  const user = users.find((u) => u.userId === userId);
  if (!user) {
    return <MuiAlert severity="error">User not found: {userId}</MuiAlert>;
  }

  return <UserStatsComponentWithMenu users={users} selectedUser={user} />;
}
