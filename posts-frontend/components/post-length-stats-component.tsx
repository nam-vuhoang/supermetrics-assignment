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
import { UserBlogLinkComponent } from './user-blog-link-component';

/**
 * Render a Card with user's post length statistics.
 */
export default function PostLengthStatsComponent({
  user,
}: {
  user: User;
}): JSX.Element {
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
      <CardContent sx={{ pl: 2, pr: 1 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell colSpan={2} padding="none" sx={{ pl: 2 }}>
                  <MaterialUtils.ButtonLike>
                    Lengths of posts
                  </MaterialUtils.ButtonLike>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={{ pr: 1 }}>Min length</TableCell>
                <TableCell className="right padding-small" sx={{ pl: 1 }}>
                  {user.stats.minLength} characters
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ pr: 1 }}>Av. length</TableCell>
                <TableCell className="right" sx={{ pl: 1 }}>
                  {user.stats.averageLength} characters
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  className="bold nowrap padding-small"
                  sx={{ borderBottomWidth: 0, pr: 1 }}
                >
                  Max length
                </TableCell>
                <TableCell
                  className="bold nowrap right"
                  sx={{ borderBottomWidth: 0, pl: 1 }}
                >
                  {user.stats.maxLength} characters
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
