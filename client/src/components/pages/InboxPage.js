import React, {Component} from "react";
import PropTypes from "prop-types";
import { message_display } from "../modules/enums";
import "../../utilities";
import "../../utilities.css";
import "./InboxPage.css";
import Toggle from 'react-toggle';
import "react-toggle/style.css"

const makeMessageNice = (message) => {
  let messageClassname = "ChatBubble-textContainer";
  if (message[1] === message_display.FROMME) {
    messageClassname += " ChatBubble-textContainer-fromme";
  } else {
    messageClassname += " ChatBubble-textContainer-fromyou";
  }
  return (
    <div className={messageClassname}>
    {message[0]}
    </div>
  );
};



class InboxPage extends Component{
  constructor(props) {
    super(props);
    this.state = {
      lastSearchQuery: "",
      searchBoxContents: "",
      chatBoxContents: "",
      lastMessageSubmitted: "",
      displayedMessages: [],
      fromMe: true,
    };
    this.ChatBoxUpdate = this.ChatBoxUpdate.bind(this);
    this.SearchBoxUpdate = this.SearchBoxUpdate.bind(this);
    this.SearchBoxKey= this.SearchBoxKey.bind(this);
    this.ChatBoxKey = this.ChatBoxKey.bind(this);
    this.ToggleFromMe = this.ToggleFromMe.bind(this);
  }

  componentDidMount() {

  }

  ToggleFromMe(event) {
    this.setState({fromMe: !this.state.fromMe});
  }

  ChatBoxUpdate(event) {
    this.setState({chatBoxContents: event.target.value});
  }

  ChatBoxKey(event) {
    if(event.keyCode === 13 && event.shiftKey) {
      const typeOfMessage = (this.state.fromMe ? message_display.FROMME : message_display.FROMYOU);
      this.state.displayedMessages.push([this.state.chatBoxContents, typeOfMessage]);
      this.setState({
        lastMessageSubmitted: this.state.chatBoxContents,
        chatBoxContents: "",
      });
    }
  }

  SearchBoxUpdate(event) {
    this.setState({searchBoxContents: event.target.value});
  }

  SearchBoxKey(event) {
    if (event.keyCode === 13) {
      this.setState({
        lastSearchQuery: this.state.searchBoxContents,
        searchBoxContents: "",
      });
      // todo: trigger a search
    }
  }

  render() {
    return (
    <div className="InboxPage-container">
      <Toggle
        id='fromme-toggle'
        defaultChecked={this.state.fromMe}
        onChange={this.ToggleFromMe}
      />
      <div className="Messages-container">
        <input className="MessageSearch"
          type="text"
          placeholder="Search messages..."
          value={this.state.searchBoxContents}
          onChange={this.SearchBoxUpdate}
          onKeyDown={this.SearchBoxKey}
          />

      </div>

      <div className="Chat-container">
        {this.state.displayedMessages.map(makeMessageNice)}

        <textarea
        rows="10"
        cols="30"
        className="ChatBox" 
        placeholder="Type here"
        value={this.state.chatBoxContents}
        onChange={this.ChatBoxUpdate}
        onKeyUp={this.ChatBoxKey}
        />
        </div>
    </div>
    );
  }
}

InboxPage.propTypes = {

};

export default InboxPage;