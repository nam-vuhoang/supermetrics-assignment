'use client';

import { Table, TableRow, TableCell, Typography } from '@mui/material';
import Link from 'next/link';
import { User } from '../../../models/user';

export function UserListMenu({ users }: { users: User[] }) {
  return (
    <Table>
      <TableRow>
        <TableCell>
          <Link href={`/dashboard/`} shallow>
            <Typography fontWeight="bold" color="primary">
              Pivot table
            </Typography>
          </Link>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell sx={{ borderBottomWidth: 0 }}>
          {users.map((u) => (
            <div key={u.userId}>
              <Link href={`/dashboard/${encodeURIComponent(u.userId)}`} shallow>
                <Typography color="primary">{u.userName}</Typography>
              </Link>
            </div>
          ))}
        </TableCell>
      </TableRow>
    </Table>
  );
}
