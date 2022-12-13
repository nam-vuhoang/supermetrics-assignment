import moment from 'moment';
import { Component, ReactNode } from 'react';
import { Post } from '../models/post';
import {
  AccountBox as AccountBoxIcon,
  AccessTime as AccessTimeIcon,
  Visibility as VisibilityIcon,
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

export class PostComponent extends Component<
  { post: Post; expand: boolean },
  { displayFull: boolean }
> {
  static readonly MAX_SHORT_MESSAGE_LENGTH = 150;
  state = { displayFull: this.props.expand };

  static formatCaption(userId: string, userName: string): ReactNode {
    return (
      <Link
        href={`/${encodeURIComponent(userId)}`}
        variant="body1"
        fontWeight="bold"
        underline="hover"
      >
        {userName}
      </Link>
    );
  }

  private formatCreatedTime(): ReactNode {
    const createdTime = moment(this.props.post.createdTime);
    const createdTimeString = createdTime.format('dddd, D MMMM YYYY [at] LT');
    const diff = moment().diff(createdTime);
    const diffString = moment.duration(diff).humanize();

    return (
      <>
        <Tooltip title={createdTimeString}>
          <span>
            <AccessTimeIcon sx={{ fontSize: 14 }} />
            {` ${diffString} ago`}
          </span>
        </Tooltip>
      </>
    );
  }

  private formatShortMessage(): ReactNode {
    const { message } = this.props.post;
    if (message.length <= PostComponent.MAX_SHORT_MESSAGE_LENGTH) {
      return message;
    }

    const shortMessage = message.substring(
      0,
      message.lastIndexOf(' ', PostComponent.MAX_SHORT_MESSAGE_LENGTH)
    );
    if (message === shortMessage) {
      return message;
    }

    return (
      <>
        {`${shortMessage} ... `}
        <IconButton
          size="small"
          onClick={() => this.setState({ displayFull: true })}
        >
          <VisibilityIcon />
        </IconButton>
      </>
    );
  }

  render(): ReactNode {
    const { post } = this.props;
    const { displayFull } = this.state;

    return (
      <Card>
        <CardHeader
          avatar={MaterialUtils.formatAvatar(post.userName)}
          title={PostComponent.formatCaption(post.userId, post.userName)}
          subheader={this.formatCreatedTime()}
          action={
            <IconButton
              href={`/dashboard/${encodeURIComponent(post.userId)}`}
              aria-label="dashboard"
            >
              <BarChart fontSize='small' />
            </IconButton>
          }
        ></CardHeader>
        <CardContent>
          <Typography
            variant="body2"
            color="text.secondary"
            align="justify"
            fontStyle="italic"
            gutterBottom
          >
            {displayFull ? post.message : this.formatShortMessage()}
          </Typography>
        </CardContent>
        <CardActions>
          <Box>
            <IconButton aria-label="add to favorites">
              <FavoriteIcon />
            </IconButton>
            <IconButton aria-label="share">
              <ShareIcon />
            </IconButton>
          </Box>{' '}
          <Box sx={{ pr: 0 }}>
            <Rating />
          </Box>
        </CardActions>
      </Card>
    );
  }
}
