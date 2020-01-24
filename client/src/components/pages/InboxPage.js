import React, {Component} from "react";
import PropTypes from "prop-types";
import { message_display, listing_type } from "../modules/enums";
import { get, post } from "../../utilities";
import "../../utilities";
import "../../utilities.css";
import "./InboxPage.css";
import Toggle from 'react-toggle';
import "react-toggle/style.css"
import moment from "moment";

const makeMessageNice = (message) => {
  let messageClassname = "ChatBubble-textContainer";
  if (message[1] === message_display.FROMME) {
    messageClassname += " ChatBubble-textContainer-fromme";
  } else {
    messageClassname += " ChatBubble-textContainer-fromyou";
  }
  const splitMessage = message[0].split('\n');
  const splitMessageTail = splitMessage.slice(1);
  const breakln = (
    <br/>
  );
  return (
    <div className={messageClassname}>
      {splitMessage[0]}
    {splitMessageTail.map((mes)=>{
      return (
        <>
        {breakln}
        {mes}
        </>
      );
    })}
    </div>
  );
};

const makeThreadNice = (thread) => {
  return (
    <div>
      {thread.recipient_ID}
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
      threadsToDisplay: [],
      activeThread: {},
      fromMe: true, // development
    };
    this.ChatBoxUpdate = this.ChatBoxUpdate.bind(this);
    this.SearchBoxUpdate = this.SearchBoxUpdate.bind(this);
    this.SearchBoxKey= this.SearchBoxKey.bind(this);
    this.ChatBoxKey = this.ChatBoxKey.bind(this);
    this.ToggleFromMe = this.ToggleFromMe.bind(this); // for development
    this.ChatGoToBottom = this.ChatGoToBottom.bind(this);
  }

  async componentDidMount() {
    const uidresponse = await get("/api/myuid");
    const userId = uidresponse.userId;
    const response = await get("/api/getthreads");
    this.setState({threadsToDisplay: response.threads});
    if (response.threads.length > 0) {
      this.setState({activeThread: response.threads[0]});
      const mresponse = await get("/api/getmessages", {threadId: this.state.activeThread._id});
      mresponse.messageList.foreach((mes)=>{
        if(mes.sender_ID === userId) {
          this.state.displayedMessages.push([mes.content, listing_type.FROMME]);
        } else {
          this.state.displayedMessages.push([mes.content, listing_type.FROMYOU]);
        }
      });
     }
  }


  ChatGoToBottom() {
   let element = document.getElementById("ChatBubblesContainer");
   element.scrollTop = element.scrollHeight - element.clientHeight;
  }

  ToggleFromMe(event) {
    this.setState({fromMe: !this.state.fromMe});
  } // for development

  ChatBoxUpdate(event) {
    this.setState({chatBoxContents: event.target.value});
  }

  ChatBoxKey(event) {
    if(event.keyCode === 13 && event.shiftKey) { // add newline

    } else if (event.keyCode === 13) {
      const typeOfMessage = (this.state.fromMe ? message_display.FROMME : message_display.FROMYOU);
      this.state.displayedMessages.push([this.state.chatBoxContents, typeOfMessage]);
      post("/api/postmessage", {
        content: this.state.chatBoxContents,
        threadId: this.state.activeThread._id,
        timestamp: moment().toDate(),
      }).then
      this.setState({
        lastMessageSubmitted: this.state.chatBoxContents,
        chatBoxContents: "",
      });
      setTimeout(() => {this.ChatGoToBottom();}, 100); // if you don't add this 100 ms delay, the scroll happens before the new message shows up
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
        {this.state.threadsToDisplay.map(makeThreadNice)}

      </div>

      <div className="Chat-container">
        <div className="Chat-ChatBubblesContainer"
        id="ChatBubblesContainer">
          {this.state.displayedMessages.map(makeMessageNice)}
        </div>

        <textarea
        rows="10"
        cols="30"
        className="ChatBox" 
        placeholder="Type here"
        value={this.state.chatBoxContents}
        onChange={this.ChatBoxUpdate}
        onKeyUp={this.ChatBoxKey}
        />
          <div className="Chat-howtosubmit">
            &#x21E7;+&#x23CE;&#x2000;to add newline{/* shift plus enter to add newline*/}
          </div>
        </div>
    </div>
    );
  }
}

InboxPage.propTypes = {

};

export default InboxPage;