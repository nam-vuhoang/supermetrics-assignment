import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Component, ReactNode } from 'react';
import { Post } from '../models/post';
import { User } from '../models/user';
import { MaterialUtils } from '../utils/material/material-utils';
import { MomentUtils } from '../utils/moment-utils';
import { BlogComponent } from './blog-component';
import { PostComponent } from './post-component';

export class UserStatsComponent extends Component<{
  user: User;
}> {
  render(): ReactNode {
    const { user } = this.props;

    const months = MomentUtils.createMonthlyArray(
      user.stats.frequencies.map((f) => f.month)
    );

    return (
      <Grid container columnSpacing={4} rowSpacing={6}>
        <Grid item xs={3}>
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
        </Grid>
        <Grid item xs={3}>
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
                          Lengths of posts
                        </MaterialUtils.ButtonLike>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Min length</TableCell>
                      <TableCell className="right">
                        {user.stats.minLength} characters
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Av. length</TableCell>
                      <TableCell className="right">
                        {user.stats.averageLength} characters
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        className="bold nowrap"
                        sx={{ borderBottomWidth: 0 }}
                      >
                        Max length
                      </TableCell>
                      <TableCell
                        className="bold nowrap right"
                        sx={{ borderBottomWidth: 0 }}
                      >
                        {user.stats.maxLength} characters
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <BlogComponent
            posts={user.stats.longestPosts}
            expandAll={true}
            caption="Longest post"
          />
        </Grid>
      </Grid>
    );
  }
}
