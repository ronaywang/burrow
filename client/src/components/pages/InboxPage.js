import React, {Component, PureComponent} from "react";
import PropTypes from "prop-types";
import { message_display, listing_type } from "../modules/enums";
import { get, post } from "../../utilities";
import "../../utilities";
import "../../utilities.css";
import "./InboxPage.css";
import moment from "moment";
const has = require("lodash/has");

const findActiveThread = (activeThread_ID, threads) => {
  if (threads.length === 0) {
    return null;
  }
  for (let i = 0; i < threads.length; i++) {
    if (threads[i]._id === activeThread_ID) {
      return i;
    }
  }
  return null;
}

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
      activeThreadIndex: 0,
      chatDisabled: true,
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.ChatBoxUpdate = this.ChatBoxUpdate.bind(this);
    this.SearchBoxUpdate = this.SearchBoxUpdate.bind(this);
    this.SearchBoxKey= this.SearchBoxKey.bind(this);
    this.ChatBoxKey = this.ChatBoxKey.bind(this);
    this.ChatGoToBottom = this.ChatGoToBottom.bind(this);
    this.SetActiveThread = this.SetActiveThread.bind(this);
  }


  async componentDidMount() {
    document.body.classList.remove("SplashPage-body");
    let threadToMakeActive = null;
    if (has(this.props, 'userId')) {
      console.log("has userid!");
      console.log(this.props.userId);
      if (this.props.userId !== "*") {
        const response = await get("/api/findthreadbyuser", {userId: this.props.userId});
        console.log(response);
        threadToMakeActive = response.thread;
        console.log(threadToMakeActive);
      }
    } else {
      console.log("no userid.");
      threadToMakeActive = null;
    }
    console.log(threadToMakeActive);

    const uidresponse = await get("/api/myuid");
    this.setState({userId: uidresponse.userId});
    const response = await get("/api/getthreads");
    console.log(response);
    this.setState({threadsToDisplay: response.threads});

    if (response.threads.length > 0) {
      if (threadToMakeActive !== null) {
        console.log(threadToMakeActive);
        this.setState({activeThreadIndex: findActiveThread(threadToMakeActive._id, this.state.threadsToDisplay)});
        this.SetActiveThread(this.state.activeThreadIndex);
      } else {
        this.SetActiveThread(0);
      }
    }
  }

  async SetActiveThread(i) {
    console.log(i);
    this.setState({activeThreadIndex: i});
    console.log(this.state.threadsToDisplay[i]);
    this.setState({chatDisabled: false});
    const mresponse = await get("/api/getmessages", {threadId: this.state.threadsToDisplay[i]._id});
    this.setState({displayedMessages: mresponse.messageList});
    this.ChatGoToBottom();
  }


  ChatGoToBottom() {
   let element = document.getElementById("ChatBubblesContainer");
   element.scrollTop = element.scrollHeight - element.clientHeight;
  }

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
        threadId: this.state.threadsToDisplay[this.state.activeThreadIndex]._id,
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
          index={i}
          thread={thread}
          userId={this.state.userId}
          setActiveThread={this.SetActiveThread}
          active={this.state.activeThreadIndex===i}
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
        disabled={this.state.chatDisabled}
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
    let threadClassName = "ThreadDisplay-container";
    if (this.props.active) {
      threadClassName += " ThreadDisplay-active";
    }
    return (
      <div
      className={threadClassName}
      onClick={()=>this.props.setActiveThread(this.props.index)}
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
  index: PropTypes.number.isRequired,
  active: PropTypes.bool.isRequired,
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