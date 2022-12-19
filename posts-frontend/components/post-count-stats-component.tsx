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
import { User } from '../models/user';
import { MaterialUtils } from '../utils/material/material-utils';
import { MomentUtils } from '../utils/moment-utils';
import { UserBlogLinkComponent } from './user-blog-link-component';

/**
 * Render a Card with user's post counting statistics.
 */
export default function PostCountStatsComponent({
  user,
}: {
  user: User;
}): JSX.Element {
  const months = MomentUtils.createMonthlyArrayFromNumberArray(
    user.stats.frequencies.map((f) => f.month)
  );

  return (
    <Card>
      <CardHeader
        avatar={MaterialUtils.formatAvatar(user.userName)}
        title={
          <UserBlogLinkComponent
            userId={user.userId}
            userName={user.userName}
          />
        }
        subheader="User statistics"
      ></CardHeader>
      <CardContent>
        <TableContainer>
          <Table sx={{ width: '100%' }}>
            <TableHead>
              <TableRow>
                <TableCell colSpan={2} padding="none" sx={{ pl: 2 }}>
                  <MaterialUtils.ButtonLike>
                    Number of posts
                  </MaterialUtils.ButtonLike>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell className="bold left">All time</TableCell>
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
                    className="left"
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
