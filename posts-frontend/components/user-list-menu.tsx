import {
  Table,
  TableRow,
  TableCell,
  Typography,
  Tooltip,
  TableBody,
  TableContainer,
} from '@mui/material';
import Link from 'next/link';
import { User } from '../models/user';
import IfElseElement from './utils/if-else-element';

/**
 * Render a vertical user list with links to each item.
 * @returns
 */
export default function UserListMenu({
  href,
  users,
  itemTooltip,
  allUsersItemName,
  allUsersItemTooltip,
}: {
  href: string;
  users: User[];
  itemTooltip: (userName: string) => string;
  allUsersItemName?: string;
  allUsersItemTooltip: string;
}) {
  return (
    <TableContainer>
      <Table>
        <TableBody>
          <IfElseElement
            if={allUsersItemName}
            then={
              <TableRow>
                <TableCell>
                  <Tooltip title={allUsersItemTooltip}>
                    <Link href={href} shallow>
                      <Typography fontWeight="bold" color="primary">
                        {allUsersItemName}
                      </Typography>
                    </Link>
                  </Tooltip>
                </TableCell>
              </TableRow>
            }
          />

          <TableRow>
            <TableCell sx={{ borderBottomWidth: allUsersItemName && 0 }}>
              {users.map((u) => (
                <div key={u.userId}>
                  <Tooltip title={itemTooltip(u.userName)}>
                    <Link
                      href={`${href}${encodeURIComponent(u.userId)}`}
                      shallow
                    >
                      <Typography color="primary">{u.userName}</Typography>
                    </Link>
                  </Tooltip>
                </div>
              ))}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
