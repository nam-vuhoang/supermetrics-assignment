import prettyMilliseconds from 'pretty-ms';
import moment from 'moment';
import { Component } from 'react';
import { Post } from '../models/post';
import { AccountBox, AccessTime, Visibility } from '@mui/icons-material';
import { Grid, IconButton, Tooltip, Typography } from '@mui/material';

export class PostView extends Component<{ post: Post }, { showFull: boolean }> {
  static readonly MAX_SHORT_MESSAGE_LENGTH = 150;
  state = { showFull: false };

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
          onClick={() => this.setState({ showFull: true })}
        >
          <Visibility />
        </IconButton>
      </>
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
            <AccessTime sx={{ fontSize: 14 }} />
            {`${diffString} ago`}
          </span>
        </Tooltip>
      </>
    );
  }

  render() {
    // const [isMounted, setIsMounted] = useState(false);
    const { post } = this.props;
    const { showFull } = this.state;

    return (
      // https://mui.com/material-ui/icons/
      // List of icons: https://mui.com/material-ui/material-icons/
      <div>
        <Grid container direction="row" alignItems="center">
          <Grid item>
            <Tooltip title={post.userName}>
              <AccountBox color="primary" fontSize="large" />
            </Tooltip>
          </Grid>
          <Grid item>
            <Typography
              variant="caption"
              fontSize="large"
              color="primary"
              fontWeight="bold"
              gutterBottom
            >
              {post.userName}
            </Typography>
          </Grid>
        </Grid>
        {this.formatCreatedTime()}

        <Typography
          variant="body1"
          align="justify"
          fontStyle="italic"
          gutterBottom
        >
          {showFull ? post.message : this.formatShortMessage()}
        </Typography>
        <br />
        <br />
      </div>
    );
  }
}
