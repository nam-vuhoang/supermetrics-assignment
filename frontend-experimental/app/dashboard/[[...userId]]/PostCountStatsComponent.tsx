'use client';

import {
  Card,
  CardHeader,
  CardContent,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { MaterialUtils } from '../../../components/utils/material-utils';
import { User } from '../../../models/user';
import { MomentUtils } from '../../../utils/moment-utils';
import { PostComponent } from '../../PostComponent';

export function PostCountStatsComponent({ user }: { user: User }) {
  const months = MomentUtils.createMonthlyArray(
    user.stats.frequencies.map((f) => f.month)
  );

  return (
    <Card>
      <CardHeader
        avatar={MaterialUtils.formatAvatar(user.userName)}
        title={PostComponent.formatCaption(user.userId, user.userName)}
        subheader="User statistics"
      ></CardHeader>
      <CardContent>
        <TableContainer>
          <Table sx={{ width: '100%' }}>
            <TableHead>
              <TableRow>
                <TableCell colSpan={2} padding="none">
                  <MaterialUtils.ButtonLike>
                    Number of posts
                  </MaterialUtils.ButtonLike>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell className="bold">All time</TableCell>
                <TableCell className="bold right">
                  {user.stats.totalCount} posts
                </TableCell>
              </TableRow>
              {months.map((m, index) => (
                <TableRow key={m.valueOf()}>
                  <TableCell
                    sx={{
                      borderBottomWidth:
                        index === months.length - 1 ? 0 : undefined,
                    }}
                  >
                    {m.format('MMM YYYY')}
                  </TableCell>
                  <TableCell
                    className="right"
                    sx={{
                      borderBottomWidth:
                        index === months.length - 1 ? 0 : undefined,
                    }}
                  >
                    {`${
                      user.stats.frequencies.find(
                        (f) => f.month === m.valueOf()
                      )?.count || 0
                    } posts`}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
