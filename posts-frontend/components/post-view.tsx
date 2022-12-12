import prettyMilliseconds from 'pretty-ms';
import moment from 'moment';
import { Component } from 'react';
import { Post } from '../models/post';
import {
  AccountBox as AccountBoxIcon,
  AccessTime as AccessTimeIcon,
  Visibility as VisibilityIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  IconButtonProps,
  Link,
  Tooltip,
  Typography,
} from '@mui/material';
import { MaterialUtils } from '../utils/material/material-utils';

export class PostView extends Component<
  { post: Post },
  { displayFull: boolean }
> {
  static readonly MAX_SHORT_MESSAGE_LENGTH = 150;
  state = { displayFull: false };

  private formatCaption(): JSX.Element {
    const { userId, userName } = this.props.post;
    return (
      <Link
        href={`?userId=${userId}`}
        variant="body1"
        fontWeight="bold"
        underline="hover"
      >
        {userName}
      </Link>
    );
  }

  private formatCreatedTime(): JSX.Element {
    const createdTime = moment(this.props.post.createdTime);
    const createdTimeString = createdTime.format('dddd, D MMMM YYYY [at] LT');
    const diff = moment().diff(createdTime);
    const diffString = prettyMilliseconds(diff, {
      compact: true,
      secondsDecimalDigits: 0,
    });

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

  private formatShortMessage(): string | JSX.Element {
    const { message } = this.props.post;
    if (message.length <= PostView.MAX_SHORT_MESSAGE_LENGTH) {
      return message;
    }

    const shortMessage = message.substring(
      0,
      message.lastIndexOf(' ', PostView.MAX_SHORT_MESSAGE_LENGTH)
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

  render() {
    // const [isMounted, setIsMounted] = useState(false);
    const { post } = this.props;
    const { displayFull } = this.state;

    return (
      // https://mui.com/material-ui/icons/
      // List of icons: https://mui.com/material-ui/material-icons/
      <Card>
        <CardHeader
          avatar={MaterialUtils.formatAvatar(post.userName)}
          title={this.formatCaption()}
          subheader={this.formatCreatedTime()}
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
        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
        </CardActions>
      </Card>
    );
  }
}
