import {
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { stat, Stats } from 'fs';
import moment from 'moment';
import { Moment } from 'moment';
import { Component, ReactNode } from 'react';
import { UserStats } from '../models/user-stats';
import { MaterialUtils } from '../utils/material/material-utils';
import { MomentUtils } from '../utils/moment-utils';
import { PostView } from './post-view';

export class UserStatsView extends Component<{ stats: UserStats }> {
  render(): ReactNode {
    const { stats } = this.props;

    const months = MomentUtils.createMonthlyArray(
      stats.frequencies.map((f) => f.month)
    );

    return (
      <Card>
        <CardHeader
          avatar={MaterialUtils.formatAvatar(stats.userName)}
          title={PostView.formatCaption(stats.userId, stats.userName)}
          subheader="User statistics"
        ></CardHeader>
        <CardContent>
          <TableContainer>
            <Table sx={{ width: '100%' }}>
              <TableHead>
                <TableRow>
                  <TableCell colSpan={2}>Number of posts</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Total count</TableCell>
                  <TableCell>{stats.totalCount} posts</TableCell>
                </TableRow>
                {months.map((m) => (
                  <TableRow key={m.valueOf()}>
                    <TableCell>{m.format('MMM YYYY')}</TableCell>
                    <TableCell>
                      {`${
                        stats.frequencies.find((f) => f.month === m.valueOf())
                          ?.count || 0
                      } posts`}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableHead>
                <TableRow>
                  <TableCell colSpan={2}>Lengths of posts</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Min length</TableCell>
                  <TableCell>{stats.minLength} characters</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Av. length</TableCell>
                  <TableCell>{stats.averageLength} characters</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Max length</TableCell>
                  <TableCell>{stats.maxLength} characters</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    );
  }
}
