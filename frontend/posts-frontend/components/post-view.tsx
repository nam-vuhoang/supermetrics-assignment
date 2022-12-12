import prettyMilliseconds from "pretty-ms";
import moment from "moment";
import { Component } from "react";
import { Post } from "../models/post";
import { Button, Tooltip } from "@nextui-org/react";
import { AccountBox, AccessTime } from "@mui/icons-material";
import styles from "./post-view.module.scss";

export class PostView extends Component<{ post: Post }, { showFull: boolean }> {
  static readonly MAX_SHORT_MESSAGE_LENGTH = 250;
  state = { showFull: false };

  private get formattedShortMessage() {
    const { message } = this.props.post;
    if (message.length <= PostView.MAX_SHORT_MESSAGE_LENGTH) {
      return message;
    }

    const shortMessage = message.substring(0, message.lastIndexOf(" ", PostView.MAX_SHORT_MESSAGE_LENGTH));
    if (message === shortMessage) {
      return message;
    }

    return (
      <>
        {`${shortMessage} ... `}
        <a href="#" onClick={() => this.setState({ showFull: true })}>
          See more
        </a>
      </>
    );
  }

  private get formattedCreatedTime() {
    const createdTime = moment(this.props.post.createdTime);
    const diff = moment().diff(createdTime);

    return (
      <Tooltip content={createdTime.format("dddd, D MMMM YYYY [at] LT")} placement="right">
        <AccessTime sx={{ fontSize: 14 }} />
        {`${prettyMilliseconds(diff, {
          compact: true,
          secondsDecimalDigits: 0,
        })} ago`}
      </Tooltip>
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
        <AccountBox fontSize="large" />
        <strong>{post.userName}</strong>
        <br />
        {/* {post.type === "status" ? <ChatBubbleOutline fontSize="small" /> : <ChatBubbleOutline fontSize="small" />} */}
        {this.formattedCreatedTime}
        <div className={styles.message}>{showFull ? post.message : this.formattedShortMessage}</div>
        <br />
        <br />
      </div>
    );
  }
}
