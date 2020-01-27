import React, {Component, PureComponent} from "react";
import PropTypes from "prop-types";
import { message_display, listing_type } from "../modules/enums";
import { get, post } from "../../utilities";
import "../../utilities";
import "../../utilities.css";
import "./InboxPage.css";
import moment from "moment";
const has = require("lodash/has");

class InboxPage extends Component{
  constructor(props) {
    super(props);
    this.state = {
      userId: "",
      lastSearchQuery: "",
      searchBoxContents: "",
      chatBoxContents: "",
      lastMessageSubmitted: "",
      displayedMessages: [],
      threadsToDisplay: [],
      activeThread: {},
      fromMe: true, // development
      prototypelistingId: "5e2b70d459cc704ca9adcf4c", // development
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.ChatBoxUpdate = this.ChatBoxUpdate.bind(this);
    this.SearchBoxUpdate = this.SearchBoxUpdate.bind(this);
    this.SearchBoxKey= this.SearchBoxKey.bind(this);
    this.ChatBoxKey = this.ChatBoxKey.bind(this);
    this.ToggleFromMe = this.ToggleFromMe.bind(this); // for development
    this.ChatGoToBottom = this.ChatGoToBottom.bind(this);
    this.SetActiveThread = this.SetActiveThread.bind(this);
  }


  async componentDidMount() {
    let threadToMakeActive;
    if (has(this.props, 'userId')) {
      console.log("has userid!");
      console.log(this.props.userId);
      const response = await get("/api/findthreadbyuser", {userId: this.props.userId});
      console.log(response);
      threadToMakeActive = response.thread;
    } else {
      console.log("no userid.");
      threadToMakeActive = 0;
    }
    console.log(threadToMakeActive);

    const uidresponse = await get("/api/myuid");
    this.setState({userId: uidresponse.userId});
    const response = await get("/api/getthreads");
    console.log(response);
    this.setState({threadsToDisplay: response.threads});



    if (response.threads.length > 0) {
      if (threadToMakeActive !== 0) {
        this.setState({activeThread: threadToMakeActive});
      } else {
        this.setState({activeThread: response.threads[0]});
      }
      const mresponse = await get("/api/getmessages", {threadId: this.state.activeThread._id});
      this.setState({displayedMessages: mresponse.messageList});
      this.ChatGoToBottom();
     }
  }

  async SetActiveThread(thread) {
    this.setState({activeThread: thread});
      const mresponse = await get("/api/getmessages", {threadId: this.state.activeThread._id});
      this.setState({displayedMessages: mresponse.messageList});
      this.ChatGoToBottom();
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
      this.state.displayedMessages.push({
        content: this.state.chatBoxContents,
        sender_ID: this.state.userId,
      });
      console.log(this.state.activeThread);
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
      <div className="Messages-container">
        <input className="MessageSearch"
          type="text"
          placeholder="Search messages..."
          value={this.state.searchBoxContents}
          onChange={this.SearchBoxUpdate}
          onKeyDown={this.SearchBoxKey}
          />

        {this.state.threadsToDisplay.map((thread, i)=>{return (
          <ThreadDisplay
          key={i}
          thread={thread}
          userId={this.state.userId}
          setActiveThread={this.SetActiveThread}
          />
        );})}

      </div>

      <div className="Chat-container">
        <div className="Chat-ChatBubblesContainer"
        id="ChatBubblesContainer">
          {/*this.state.displayedMessages.map(makeMessageNice)*/}
          {this.state.displayedMessages.map((message, i)=>{return (
            <MessageDisplay
              key={i}
              message={message}
              userId={this.state.userId}
              />
          );})}
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
  userId: PropTypes.string,
};

export default InboxPage;

class ThreadDisplay extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let userIsSender;
    let nameToDisplay;
    const thread = this.props.thread;
    let senderid;
    let recipid;
    if (has(thread.sender_ID, '_id')) {
      senderid = thread.sender_ID._id;
    } else {
      senderid = thread.sender_ID;
    }

    if (has(thread.recipient_ID, '_id')) {
      recipid = thread.recipient_ID._id;
    } else {
      recipid = thread.recipient_ID;
    }

    userIsSender =  (this.props.userId === senderid);

    const displayid = userIsSender ? thread.recipient_ID : thread.sender_ID;

    if (has(displayid, 'firstName')) {
      nameToDisplay = displayid.firstName;
    } else {
      nameToDisplay = JSON.stringify(displayid);
    }

    return (
      <div
      className="ThreadDisplay-container"
      onClick={()=>this.props.setActiveThread(this.props.thread)}
      >
        <div className="ThreadDisplay-name">
          {nameToDisplay}
        </div>
      </div>
    );
  }
}

ThreadDisplay.propTypes = {
  thread: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  setActiveThread: PropTypes.func,
};

class MessageDisplay extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fromme: false,
    };
  }

   render () {
    let messageClassname = "ChatBubble-textContainer";
    if (this.props.message.sender_ID === this.props.userId) {
      messageClassname += " ChatBubble-textContainer-fromme";
    } else {
      messageClassname += " ChatBubble-textContainer-fromyou";
    }
    return (
      <div className={messageClassname}>
        {this.props.message.content}
      </div>
    );
  }
}

MessageDisplay.propTypes = {
  userId: PropTypes.string.isRequired,
  message: PropTypes.object.isRequired
}