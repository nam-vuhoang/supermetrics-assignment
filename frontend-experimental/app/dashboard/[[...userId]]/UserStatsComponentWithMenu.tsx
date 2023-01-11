'use client';

import { Button } from '@mui/material';
import { useState } from 'react';
import MuiGrid from '../../../components/use-client/MuiGrid';
import { User } from '../../../models/user';
import { Utils } from '../../../utils/utils';
import { BlogComponent } from '../../BlogComponent';
import { PostCountStatsComponent } from './PostCountStatsComponent';
import { PostLengthStatsComponent } from './PostLengthStatsComponent';
import { UserListMenu } from './UserListMenu';
import { UserStatsComponent } from './UserStatsComponent';

export function UserStatsComponentWithMenu({
  users,
  selectedUser,
}: {
  users: User[];
  selectedUser: User;
}) {
  const [user, setUser] = useState(selectedUser);

  return (
    <MuiGrid container columnSpacing={4}>
      <MuiGrid item xs={2}>
        <h4>{user.userName}</h4>
        {/* <Button onClick={() => setUser(users[Utils.getRandomInt(users.length)])}>Change ID</Button> */}
        <UserListMenu users={users} selectUser={(user) => setUser(user)} />
      </MuiGrid>

      {/* User stats */}
      <MuiGrid item xs={10}>
        <UserStatsComponent user={user} />
      </MuiGrid>
    </MuiGrid>
  );
}
