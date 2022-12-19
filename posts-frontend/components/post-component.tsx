import { Post } from '../models/post';
import {
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  BarChart,
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Link,
  Rating,
  Tooltip,
  Typography,
} from '@mui/material';
import { MaterialUtils } from '../utils/material/material-utils';
import React from 'react';
import { UserBlogLinkComponent } from './user-blog-link-component';
import ShortMessageComponent from './short-message-component';
import TimeDiffComponent from './time-diff-component';
import moment from 'moment';
import UserNameAvatar from './user-name-avatar';

/**
 * Render a single post view in a Card style.
 */
export default function PostComponent({
  post,
  caption,
  hideDashboardLink,
  expand,
}: {
  post: Post;
  caption?: string;
  expand: boolean;
  hideDashboardLink?: boolean;
}): JSX.Element {
  return (
    <Card>
      <CardHeader
        avatar={<UserNameAvatar name={post.userName} />}
        title={
          <UserBlogLinkComponent
            userId={post.userId}
            userName={post.userName}
          />
        }
        subheader={<TimeDiffComponent time={moment.utc(post.createdTime)} />}
        action={MaterialUtils.conditionalNode(
          !hideDashboardLink,
          <Tooltip title={`Click to see ${post.userName}'s dashboard page`}>
            <IconButton
              href={`/dashboard/${encodeURIComponent(post.userId)}`}
              aria-label="dashboard"
            >
              <BarChart fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      />

      <CardContent>
        {MaterialUtils.conditionalNode(
          caption,
          <MaterialUtils.ButtonLike>{caption}</MaterialUtils.ButtonLike>
        )}
        <Typography
          variant="body2"
          color="text.secondary"
          align="justify"
          fontStyle="italic"
          gutterBottom
        >
          <ShortMessageComponent message={post.message} expand={expand} />
        </Typography>
      </CardContent>

      <CardActions>
        <Box sx={{ flexGrow: 1 }}>
          <Tooltip title={`Post ID: ${post.id}`}>
            <IconButton aria-label="add to favorites">
              <FavoriteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={`Post ID: ${post.id}`}>
            <IconButton aria-label="share">
              <ShareIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Tooltip title="Please, rate me!">
          <Rating aria-label="rate" />
        </Tooltip>
      </CardActions>
    </Card>
  );
}
