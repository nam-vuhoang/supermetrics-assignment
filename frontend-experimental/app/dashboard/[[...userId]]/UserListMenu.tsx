'use client';

import { Table, TableRow, TableCell, Typography, Button } from '@mui/material';
import Link from 'next/link';
import { User } from '../../../models/user';

// function ShallowLink() {
//   return <NextLink href=''
// }

export function UserListMenu({
  users,
  selectUser,
}: {
  users: User[];
  selectUser: (user: User) => void;
}) {
  return (
    <Table>
      <TableRow>
        <TableCell>
          <Link href={`/test/dashboard/`}>
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
              <Link href={`/test/dashboard/${encodeURIComponent(u.userId)}`} shallow>
                <Typography color="primary">{u.userName}</Typography>
              </Link>
              {/* <Link component="button" onClick={() => selectUser(u)}>
                <Typography color="primary">{u.userName}</Typography>
              </Link> */}
              {/* <Button onClick={() => selectUser(u)}>
                <Typography color="primary">{u.userName}</Typography>
              </Button> */}
            </div>
          ))}
        </TableCell>
      </TableRow>
    </Table>
  );
}
