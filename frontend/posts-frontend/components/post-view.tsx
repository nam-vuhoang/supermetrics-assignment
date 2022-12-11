import prettyMilliseconds from "pretty-ms";
import moment from "moment";
import { Component } from "react";
import { Post } from "../models/post";

export class PostView extends Component<{ post: Post }, { showFull: boolean }> {
  static readonly MAX_SHORT_MESSAGE_LENGTH = 200;
  state = { showFull: false };

  private setShowFull() {
    this.setState({ showFull: true });
  }

  private get shortMessage() {
    const message = this.props.post.message;
    if (message.length <= PostView.MAX_SHORT_MESSAGE_LENGTH) {
      return message;
    }

    const shortMessage = message.substring(0, message.lastIndexOf(" ", PostView.MAX_SHORT_MESSAGE_LENGTH));
    if (message === shortMessage) {
      return message;
    }

    return (
      <>
        {shortMessage + " ... "}
        <a href="#" onClick={() => this.setShowFull()}>
          See more
        </a>
      </>
    );
  }

  private get formattedCreatedTime() {
    // TODO: display as tooltip
    const createdTime = moment(this.props.post.createdTime);
    const diff = moment().diff(createdTime);

    return `${createdTime.format("dddd, D MMMM YYYY [at] LT")} (${prettyMilliseconds(diff, {
      compact: true,
      secondsDecimalDigits: 0,
    })} ago)`;
  }

  render() {
    // const [isMounted, setIsMounted] = useState(false);
    const { post } = this.props;
    const { showFull } = this.state;

    return (
      <div>
        <strong>{post.userName}</strong>
        <br />
        {this.formattedCreatedTime}
        <br />
        {showFull ? post.message : this.shortMessage}
        <br />
        <br />
      </div>
    );
  }
}
